const express = require('express');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();
const { RealOrder } = require('./model.js');
const sendNotification = require('./sendNotification');
const router = express.Router();

router.use(express.json());

// Add a new middleware to clear PhonePe cookies
const clearPhonePeCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  };

  res.clearCookie('mercury-t2.phonepe.com', { ...cookieOptions, domain: '.phonepe.com' });
  res.clearCookie('phonepe.com', { ...cookieOptions, domain: 'phonepe.com' });
};

// Utility function to generate SHA256 hash
const generateSHA256Hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Add payment session tracking
const activePaymentSessions = new Map();

// Create Payment Endpoint
router.post('/create-payment', async (req, res) => {
  const { mobile, orderSummary, amount, address } = req.body;

  // Check if there's an active payment session for this mobile number
  const existingSession = Array.from(activePaymentSessions.values())
    .find(session => session.mobile === mobile &&
      (Date.now() - session.timestamp) < 300000); // 5 minutes timeout

  if (existingSession) {
    // Cancel the existing session
    await RealOrder.findOneAndUpdate(
      { orderId: existingSession.orderId },
      { paymentStatus: 'Cancelled' }
    );
    activePaymentSessions.delete(existingSession.orderId);
  }

  const orderId = `VR${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Create new payment session
  activePaymentSessions.set(orderId, {
    mobile,
    timestamp: Date.now(),
    orderId
  });

  // Cleanup old sessions
  setTimeout(() => {
    activePaymentSessions.delete(orderId);
  }, 300000); // 5 minutes timeout

  const order = new RealOrder({
    orderId,
    mobile,
    address,
    amount,
    orderSummary,
    paymentStatus: 'Pending',
    timestamp: new Date(),
    retryCount: 0
  });

  await order.save();

  try {
    const payload = {
      merchantId: process.env.MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: mobile, // Use mobile number as user ID for better tr
      // acking
      amount: amount * 100,
      redirectUrl: `${process.env.WEB_BASE_URL}/pages/success.html?orderId=${orderId}`,
      redirectMode: "POST",
      callbackUrl: `${process.env.WEB_BASE_URL}/payment-callback`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const hashData = `${encodedPayload}/pg/v1/pay${process.env.KEY}`;
    const hash = generateSHA256Hash(hashData);
    const checksum = `${hash}###${process.env.SALT_INDEX}`;

    const response = await axios.post(
      `${process.env.BASE_URL}/pg/v1/pay`,
      { request: encodedPayload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
      }
    );

    if (response.data.success) {
      res.json({
        status: "success",
        paymentLink: response.data.data.instrumentResponse.redirectInfo.url,
        orderId,
      });
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error.message);
    activePaymentSessions.delete(orderId);
    await RealOrder.findOneAndUpdate(
      { orderId },
      { paymentStatus: 'Failed' }
    );
    res.status(500).json({
      status: "error",
      message: "Failed to create payment.",
      error: error.message
    });
  }
});

router.post('/payment-callback', async (req, res) => {
  const { response } = req.body;
  let parsedResponse;

  try {
    const decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
    parsedResponse = JSON.parse(decodedResponse);

    const { data } = parsedResponse;
    if (!data || !data.transactionId) {
      throw new Error('Invalid response data');
    }

    const { transactionId, paymentState } = data;
    const order = await RealOrder.findOne({ orderId: transactionId });

    if (!order) {
      throw new Error('Order not found');
    }

    // Update payment status
    order.paymentStatus = {
      'COMPLETED': 'Completed',
      'FAILED': 'Failed',
      'CANCELLED': 'Cancelled'
    }[paymentState] || 'Pending';

    // Clear session and cookies if payment is complete or cancelled
    if (['Completed', 'Failed', 'Cancelled'].includes(order.paymentStatus)) {
      activePaymentSessions.delete(transactionId);
      clearAllCookies(res);  // Clear all cookies
    }

    await order.save();
    await sendNotification(order.orderId);

    res.json({
      status: "success",
      message: "Payment status updated successfully.",
      paymentStatus: order.paymentStatus
    });
  } catch (error) {
    console.error("Error in payment callback:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process callback.",
      error: error.message
    });
  }
});

// Function to clear all cookies
const clearAllCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Ensure cookies are cleared based on the environment
    path: '/'
  };

  // List of common cookies to clear
  res.clearCookie('session_id', cookieOptions);  // Example of clearing a session cookie
  res.clearCookie('user_session', cookieOptions);  // Another session cookie
  res.clearCookie('payment_gateway_session', cookieOptions);  // Payment gateway session cookie

  // If you are using specific domains, clear those as well
  res.clearCookie('mercury-t2.phonepe.com', { ...cookieOptions, domain: '.phonepe.com' });
  res.clearCookie('phonepe.com', { ...cookieOptions, domain: 'phonepe.com' });

  // Additional cookies can be added based on your app's specific needs
  res.clearCookie('user_auth_token', cookieOptions);
  res.clearCookie('user_preferences', cookieOptions);
};

// Modified success endpoint
router.post('/pages/success.html', async (req, res) => {
  const { code, transactionId } = req.body;

  try {
    const order = await RealOrder.findOne({ orderId: transactionId });
    if (!order) {
      throw new Error('Order not found');
    }

    order.paymentStatus = code === 'PAYMENT_SUCCESS' ? 'Completed' : 'Failed';
    await order.save();

    if (code === 'PAYMENT_SUCCESS') {
      await sendNotification(transactionId);
    }

    // Clear PhonePe session
    clearPhonePeCookies(res);
    activePaymentSessions.delete(transactionId);

    res.sendFile(path.join(__dirname, '../restaurant-website/pages/success.html'));
  } catch (error) {
    console.error('Error processing success page:', error);
    res.status(500).send('Error processing payment status');
  }
});

router.post('/verify-payment', async (req, res) => {
  const { orderId } = req.body
  
  try {
    const order = await RealOrder.find({orderId});
    if (!order) {
      throw new Error('Order not found');
    }
    
    res.send({ status: 'success', orderDetails: order })

  } catch (err) {
    res.send({ 'data': 'wrong-credentials' })
  }

});

module.exports = router;

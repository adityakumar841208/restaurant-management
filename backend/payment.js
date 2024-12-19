const express = require('express');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { RealOrder } = require('./model.js');
// const { sendNotification } = require('web-push');.
const sendNotification = require('./sendNotification');
const router = express.Router();

// Middleware 
router.use(express.json());

const WEB_BASE_URL = process.env.WEB_BASE_URL || 'https://vedika-restaurant.onrender.com';

// PhonePe Configuration
const PHONEPE_BASE_URL = process.env.BASE_URL;
const MERCHANT_ID = process.env.MERCHANT_ID;
const SALT_KEY = process.env.KEY;
const SALT_INDEX = process.env.SALT_INDEX;

if (!PHONEPE_BASE_URL || !MERCHANT_ID || !SALT_KEY || !SALT_INDEX) {
  console.error("Missing required environment variables. Please check your .env file.");
  process.exit(1); // Exit the application
}

// Helper Function to Generate SHA256 Hash
function generateSHA256Hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Create Payment Endpoint
router.post('/create-payment', async (req, res) => {
  const { mobile, orderSummary, amount, address } = req.body;
  const orderId = uuidv4(); // Unique order ID

  if (!mobile || !amount || !orderSummary || !address) {
    return res.status(400).json({ status: "error", message: "Missing required fields: mobile or amount." });
  }

  // Save the data to the database
  const order = new RealOrder({
    orderId,
    mobile,
    address,
    amount,
    orderSummary,
    paymentStatus: 'Pending', // Default status
    timestamp: new Date(),
  });

  await order.save();

  try {
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: "user123", // Optional
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      redirectUrl: `${WEB_BASE_URL}/pages/success.html?orderId=${orderId}`, // Redirect after payment
      redirectMode: "POST",
      callbackUrl: `${WEB_BASE_URL}/payment-callback`, // Callback for status
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const hashData = `${encodedPayload}/pg/v1/pay${SALT_KEY}`;
    const hash = generateSHA256Hash(hashData);
    const checksum = `${hash}###${SALT_INDEX}`;

    const response = await axios.post(
      `${PHONEPE_BASE_URL}/pg/v1/pay`,
      { request: encodedPayload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
      }
    );
    console.log(response)
    if (response.data.success) {
      res.json({
        status: "success",
        paymentLink: response.data.data.instrumentResponse.redirectInfo.url,
        orderId,
      });
    } else {
      res.status(400).json({ status: "error", message: response.data.message });
    }
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error.message);
    res.status(500).json({ status: "error", message: "Failed to create payment.", error: error.message });
  }
});


// Payment Callback Endpoint
router.post('/payment-callback', async (req, res) => {

  // Decode and parse the response
  const { response } = req.body;
  let parsedResponse;
  try {
    const decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
    parsedResponse = JSON.parse(decodedResponse);


  } catch (error) {
    console.error("Error decoding or parsing response:", error.message);
    return res.status(400).json({ status: "error", message: "Invalid response format." });
  }

  console.log("Parsed Response:", parsedResponse);

  // Extract required fields
  const { data } = parsedResponse;
  if (!data) {
    return res.status(400).json({ status: "error", message: "Missing data field in response." });
  }

  const { transactionId, paymentState } = data;

  if (!transactionId) {
    return res.status(400).json({ status: "error", message: "transactionId is missing in the callback." });
  }

  try {
    // Find the order using the transactionId
    const order = await RealOrder.findOne({ orderId: transactionId });

    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found." });
    }

    // Update the payment status based on the paymentState
    if (paymentState === 'COMPLETED') {
      order.paymentStatus = 'Completed';
    } else if (paymentState === 'FAILED') {
      order.paymentStatus = 'Failed';
    } else {
      order.paymentStatus = 'Pending';
    }

    // Save the updated order status
    await order.save();

    // Send notification to the owner about the updated payment status
    const message = `Order #${order.orderId} payment status: ${order.paymentStatus}`;
    sendNotification(order.orderId);

    res.json({ status: "success", message: "Payment status updated successfully." });
  } catch (error) {
    console.error("Error in payment callback:", error.message);
    res.status(500).json({ status: "error", message: "Failed to process callback.", error: error.message });
  }
});



// Manual Payment Verification Endpoint (Triggered by success.html)
router.post('/verify-payment', async (req, res) => {
  const { orderId } = req.body; // The orderId sent from success.html
  // console.log('Received orderId for verification:', orderId);

  if (!orderId) {
    return res.status(400).json({ status: "error", message: "Missing required field: orderId." });
  }

  try {
    // Step 1: Find the order by orderId
    const order = await RealOrder.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found." });
    }

    // Step 2: Check payment status
    if (order.paymentStatus === 'Completed') {
      // Payment was successful, send the order details
      res.json({ status: "success", orderDetails: order });
    } else {
      // Payment failed
      res.json({ status: "failure", message: "Payment failed. Please try again." });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ status: "error", message: "Failed to verify payment.", error: error.message });
  }
});

// Serve success.html
router.post('/pages/success.html',async (req, res) => {
  const status = req.body.code
  const transactionId = req.body.transactionId
  // console.log(transactionId)
  const order = await RealOrder.findOne({orderId: transactionId})
  // console.log(order)
  if(status === 'PAYMENT_SUCCESS'){
    order.paymentStatus = 'Completed'
    await order.save()

    await sendNotification(transactionId)
  }else{
    order.paymentStatus = 'Failed'
    await order.save()
  }
  // console.log('inside the post of the success',req.body.transactionId)
  res.sendFile(path.join(__dirname, '../restaurant-website/pages/success.html'));
});

module.exports = router;

// const express = require('express');
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// require('dotenv').config();

// const router = express.Router();

// const razorpayInstance = new Razorpay({
//     key_id: process.env.PAYMENT_KEYID, // Replace with your Razorpay API Key
//     key_secret: process.env.PAYMENT_SECRET // Replace with your Razorpay Secret
// });

// //if there would be error check the payment gateway and try again.

// router.use(express.json())

// // Route to create an order
// router.post('/create-order', async (req, res) => {
//     const { amount } = req.body;

//     try {
//         const order = await razorpayInstance.orders.create({
//             amount,
//             currency: 'INR',
//             receipt: `receipt_${Date.now()}`,
//         });

//         res.status(201).json(order);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Unable to create order' });
//     }
// });


// // Route to verify payment
// router.post('/verify-payment', (req, res) => {
//     const { order_id, payment_id, signature } = req.body;

//     const generatedSignature = crypto
//         .createHmac('sha256', process.env.PAYMENT_SECRET)
//         .update(`${order_id}|${payment_id}`)
//         .digest('hex');

//     if (generatedSignature === signature) {
//         res.json({ status: 'success', message: 'Payment verified successfully' });
//     } else {
//         res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
//     }
// });


// module.exports = router;

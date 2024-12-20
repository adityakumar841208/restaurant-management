const express = require('express')
const webPush = require('web-push');
require('dotenv').config()
const nodemailer = require('nodemailer');
const { RealOrder, Subscription } = require('./model')


// VAPID Keys
webPush.setVapidDetails(
    'mailto:admin@example.com', // Replace with your email
    process.env.VAPID_PUBLIC_KEY, // Replace with your public VAPID key
    process.env.VAPID_PRIVATE_KEY // Replace with your private VAPID key
);

// Setup the Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your email address from environment variables
        pass: process.env.EMAIL_PASS   // Your email password or app-specific password
    }
});


const sendNotification = async function sendNotification(orderId) {
    // Find all subscriptions from the DB
    console.log('orderId in notification', orderId)
    const subscriptions = await Subscription.find();
    const order = await RealOrder.findOne({ orderId })
    console.log('notification order is here: ', order)

    // Notification content
    const notificationPayload = JSON.stringify({
        title: 'New Order Received!',
        body: `Order from ${order.mobile}. Total: ₹${order.amount}`,
        data: { "order": orderId },
    });

    // Send notifications to all valid subscribers
    for (const subscription of subscriptions) {
        try {
            // Send notification
            await webPush.sendNotification(subscription, notificationPayload);
        } catch (error) {
            if (error.statusCode === 410) {
                // If the subscription is revoked, remove it from the database
                console.log(`Subscription revoked for ${subscription.endpoint}. Removing from DB.`);
                await Subscription.deleteOne({ endpoint: subscription.endpoint });
            } else {
                console.error('Error sending notification:', error);
            }
        }
    }

    // Send email notification to admin
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.OWNER_EMAIL,
        subject: `New Order Received`,
        text: `You have received a new order:\n\n${JSON.stringify(order, null, 2)}`,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending message: ' + error.toString());
        }
        console.log('Email sent: ' + info.response);
    });

}

module.exports = sendNotification;
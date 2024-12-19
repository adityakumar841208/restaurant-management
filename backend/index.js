const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const webPush = require('web-push');
const cors = require('cors');
require('dotenv').config();
const { Order, User, Subscription, RealOrder } = require('./model');
const pg = require('./payment');
const notificationstatus = require('./notificationstatus')

const PORT = process.env.PORT || 5000;
const app = express();


// VAPID Keys
webPush.setVapidDetails(
    'mailto:admin@example.com', // Replace with your email
    process.env.VAPID_PUBLIC_KEY, // Replace with your public VAPID key
    process.env.VAPID_PRIVATE_KEY // Replace with your private VAPID key
);

// Middleware to parse JSON and URL-encoded form data
app.use(express.static(path.join(__dirname, '../restaurant-website')));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

let orderSummary = {}; // To temporarily store order summary data

// Setup the Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your email address from environment variables
        pass: process.env.EMAIL_PASS   // Your email password or app-specific password
    }
});

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../restaurant-website', './index.html'));
});

// Route for receiving payment form data and creating an order summary
app.post('/submit-payment', async (req, res) => {
    const { transactionId, name, address, landmark, mobile, message, items } = req.body;

    // Basic validation
    if (!transactionId || !name || !address || !mobile || !items) {
        return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    // Calculate total amount
    let totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Store the order summary
    const orderSummary = {
        transactionId,
        name,
        address,
        landmark,
        mobile,
        message,
        items,
        totalAmount
    };

    // Saving the order summary 
    try {
        orderResponse = await Order.create(orderSummary);
        // console.log(_id);
    } catch (error) {
        console.log("Error while saving the data", error);
    }

    // Find all subscriptions from the DB
    const subscriptions = await Subscription.find();
    
    // Notification content
    const notificationPayload = JSON.stringify({
        title: 'New Order Received!',
        body: `Order from ${name}. Total: ₹${totalAmount}`,
        data: { "order": orderResponse._id },
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
        text: `You have received a new order:\n\n${JSON.stringify(orderSummary, null, 2)}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending message: ' + error.toString());
        }
        console.log('Email sent: ' + info.response);
    });

    // Respond with a success message
    res.json({ message: 'Payment details submitted successfully!', orderSummary });
});


// Route to get the order summary
app.get('/order-summary', (req, res) => {
    if (!orderSummary || Object.keys(orderSummary).length === 0) {
        return res.status(404).json({ message: 'No order summary available.' });
    }

    res.json(orderSummary);
});

// Get all orders from the database
app.get('/admin/orders', async (req, res) => {
    try {
        const orders = await RealOrder.find(); // Fetch all orders
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Respond with success message
        await res.json({ message: 'Login successful!' });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});

// Route to delete an order
app.delete('/admin/orders/:transactionId', async (req, res) => {
    const { transactionId } = req.params;

    try {
        const order = await RealOrder.findOneAndDelete({ orderId: transactionId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: `Order with transaction ID ${transactionId} deleted successfully` });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Failed to delete order' });
    }
});

// Route to handle contact form submissions
app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation for the contact form
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    const mailOptions = {
        from: email,
        to: 'adityasah841208@gmail.com',
        subject: `New message from ${name}`,
        text: `You have received a new message from the contact form:\n\n
        Name: ${name}\n
        Email: ${email}\n
        Message: ${message}`
    };

    // Send the email using the configured SMTP server
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending message: ' + error.toString());
        }
        res.status(200).send('Message sent successfully');
    });
});

// route to handle the notification subscriber data save in the db 
app.post('/subscribe', async (req, res) => {
    try {
        const subscription = req.body;

        // Check if this subscription already exists (check by endpoint or another unique identifier)
        const existingSubscription = await Subscription.findOne({ 'endpoint': subscription.endpoint });

        if (existingSubscription) {
            return res.status(200).json({ message: 'Subscription already exists. No need to save.' });
        }

        // Save subscription if it doesn't exist
        const newSubscription = new Subscription(subscription);
        await newSubscription.save();
        res.status(201).json({ message: 'Subscription saved successfully!' });
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ message: 'Failed to save subscription.' });
    }
});

app.use('/', pg)
app.use('/',notificationstatus)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { Order, User } = require('./model');

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.static(path.join(__dirname, '/restaurant-website')));
app.use(express.json());
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
    orderSummary = {
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
        await Order.create(orderSummary);
    } catch (error) {
        console.log("Error while saving the data", error);
    }

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
        const orders = await Order.find(); // Fetch all orders
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
        const order = await Order.findOneAndDelete({ transactionId });

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});

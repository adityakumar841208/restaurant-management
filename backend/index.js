const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const webPush = require('web-push');
const cors = require('cors');
require('dotenv').config();
const { Order, User, Subscription } = require('./model');
const razorPay = require('./razorpay');

const PORT = process.env.PORT || 5000;
const app = express();

app.use('/', razorPay)

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

// Route for notification status
app.get('/admin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Order.findOne({ _id: id });
        if (!result) {
            return res.status(404).send('<h1 style="color: red; text-align: center;">Order not found</h1>');
        }
        console.log(result)

        // Construct HTML response with inline CSS
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Details</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f9f9f9;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #444;
                }
                .highlight {
                    color: #007BFF;
                }
                .items {
                    margin-top: 15px;
                }
                .item {
                    margin-bottom: 10px;
                }
                .item img {
                    max-width: 100px;
                    margin-right: 10px;
                }
                .item-details {
                    display: inline-block;
                    vertical-align: top;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Order Details</h1>
                <p><strong>Order ID:</strong> <span class="highlight">${result._id}</span></p>
                <p><strong>Transaction ID:</strong> ${result.transactionId}</p>
                <p><strong>Name:</strong> ${result.name}</p>
                <p><strong>Address:</strong> ${result.address}</p>
                <p><strong>Landmark:</strong> ${result.landmark}</p>
                <p><strong>Mobile:</strong> ${result.mobile}</p>
                <p><strong>Total Amount:</strong> ₹${result.totalAmount}</p>
                <p><strong>Timestamp:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
                <div class="items">
                    <h2>Items:</h2>
                    ${result.items.map(item => `
                        <div class="item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="item-details">
                                <p><strong>Name:</strong> ${item.name}</p>
                                <p><strong>Category:</strong> ${item.category}</p>
                                <p><strong>Description:</strong> ${item.description}</p>
                                <p><strong>Price:</strong> ₹${item.price}</p>
                                <p><strong>Quantity:</strong> ${item.quantity}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </body>
        </html>
        `;

        res.send(html);
    } catch (err) {
        res.status(500).send('<h1 style="color: red; text-align: center;">An error occurred</h1>');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});

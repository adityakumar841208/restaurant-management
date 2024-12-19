const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Order schema
const orderSchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    mobile: { type: String, required: true },
    message: { type: String, default: '' },
    items: [{
        id: { type: Number, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        fullPlate: { type: Number, default: null },
        halfPlate: { type: Number, default: null },
    }],
    totalAmount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// User schema for login (no bcrypt)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }  // No hashing, store password as plain text
});

// subscription schema 
const subscriptionSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
    },
    keys: {
        p256dh: {
            type: String,
            required: true,
        },
        auth: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

const User = mongoose.model('User', userSchema);

const realOrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    amount: { type: Number, required: true },
    address: { type: String, required: true},
    orderSummary: { type: Array, required: true }, // Array to hold items
    paymentStatus: { type: String, default: 'Pending' },
    timestamp: { type: Date, default: Date.now },
});

const RealOrder = mongoose.model('RealOrder',realOrderSchema);

module.exports = { Order, User, Subscription, RealOrder };

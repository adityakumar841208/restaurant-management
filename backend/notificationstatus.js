const express = require('express');
const router = express.Router();
const { RealOrder } = require('./model');

router.get('/admin/:id', async (req, res) => {
    const { id } = req.params;

    try {
        console.log("Requested Order ID:", id);

        // Step 1: Fetch the order details
        const result = await RealOrder.findOne({ orderId: id });

        console.log("Order Details:", result);

        if (!result) {
            return res.status(404).send('<h1 style="color: red; text-align: center;">Order not found</h1>');
        }

        // Step 2: Construct the HTML response
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Details</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; }
                .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
                h1 { color: #444; }
                .highlight { color: #007BFF; }
                .order-summary { margin-top: 15px; }
                .item { margin-bottom: 10px; display: flex; }
                .item img { max-width: 100px; margin-right: 10px; border-radius: 5px; }
                .item-details { display: inline-block; vertical-align: top; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Order Details</h1>
                <p><strong>Order ID:</strong> <span class="highlight">${result.orderId}</span></p>
                <p><strong>Transaction ID:</strong> ${result._id}</p>
                <p><strong>Address:</strong> ${result.address}</p>
                <p><strong>Mobile:</strong> ${result.mobile}</p>
                <p><strong>Total Amount:</strong> ₹${result.amount}</p>
                <p><strong>Timestamp:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
                <p><strong>Payment Status:</strong> ${result.paymentStatus}</p>
                <div class="order-summary">
                    <h2>Order Summary:</h2>
                    ${result.orderSummary && result.orderSummary.length 
                        ? result.orderSummary.map(item => `
                            <div class="item">
                                <img src="${item.image || '/path/to/default-image.png'}" style="height:100%;" alt="${item.name || 'Item'}">
                                <div class="item-details">
                                    <p><strong>Name:</strong> ${item.name || 'N/A'}</p>
                                    <p><strong>Category:</strong> ${item.category || 'N/A'}</p>
                                    <p><strong>Description:</strong> ${item.description || 'N/A'}</p>
                                    <p><strong>Price:</strong> ₹${item.price || 'N/A'}</p>
                                    <p><strong>Quantity:</strong> ${item.quantity || 'N/A'}</p>
                                </div>
                            </div>
                        `).join('') 
                        : '<p>No items found in the order summary</p>'}
                </div>
            </div>
        </body>
        </html>
        `;

        // Step 3: Send the constructed HTML as the response
        res.send(html);
    } catch (err) {
        console.error("Error fetching order details:", err.message);
        res.status(500).send('<h1 style="color: red; text-align: center;">An error occurred</h1>');
    }
});

module.exports = router;

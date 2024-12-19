const express = require('express')
const router = express.Router()
const {RealOrder} = require('./model')

router.get('/admin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await RealOrder.findOne({ orderId:id});
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
                <p><strong>Transaction ID:</strong> ${result.orderId}</p>
                <p><strong>Address:</strong> ${result.address}</p>
                <p><strong>Mobile:</strong> ${result.mobile}</p>
                <p><strong>Total Amount:</strong> ₹${result.amount}</p>
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

module.exports = router
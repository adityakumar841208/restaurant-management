document.addEventListener('DOMContentLoaded', function () {
    const orderSummaryElement = document.getElementById('orderSummary');
    const items = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart items from localStorage

    // If no items in the cart, inform the user
    if (items.length === 0) {
        orderSummaryElement.innerHTML = '<p>No items found in your cart. Please add items to proceed.</p>';
        document.getElementById('payButton').disabled = true;
        return;
    }

    // Generate order summary and calculate the total amount
    let orderDetailsHtml = '<ul>';
    let totalAmount = 0;

    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        orderDetailsHtml += `
            <li>${item.name} - ₹${item.price} x ${item.quantity} = ₹${itemTotal}</li>
        `;
    });

    orderDetailsHtml += `</ul><p><strong>Total Amount:</strong> ₹${totalAmount}</p>`;
    orderSummaryElement.innerHTML = orderDetailsHtml;

    // Set up payment button event
    document.getElementById('payButton').addEventListener('click', function () {
        initiatePayment(totalAmount);
    });
});

// Razorpay Payment Integration
async function initiatePayment(totalAmount) {
    try {
        const response = await fetch('/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount * 100 }) // Convert to paise
        });

        const data = await response.json();
        if (response.ok) {
            openRazorpay(data.id, totalAmount);
        } else {
            alert('Failed to create order. Please try again.');
        }
    } catch (error) {
        console.error('Error during payment initialization:', error);
        alert('An error occurred. Please try again.');
    }
}

function openRazorpay(orderId, totalAmount) {
    const options = {
        key: 'rzp_test_JxUz4FK8xKQiPE', // Replace with your Razorpay key
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Vedika Restaurant',
        description: 'Order Payment',
        order_id: orderId,
        handler: async function (response) {
            await verifyPayment(orderId, totalAmount, response);
        },
        theme: { color: '#F37254' }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
}

async function verifyPayment(orderId, totalAmount, paymentResponse) {
    try {
        const response = await fetch('/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id: orderId,
                payment_id: paymentResponse.razorpay_payment_id,
                signature: paymentResponse.razorpay_signature
            })
        });

        const verificationResult = await response.json();

        if (response.ok) {
            showReceipt(orderId, totalAmount, paymentResponse);
        } else {
            alert('Payment verification failed: ' + verificationResult.message);
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        alert('An error occurred during payment verification.');
    }
}

function showReceipt(orderId, totalAmount, paymentResponse) {
    const receiptElement = document.getElementById('receipt');
    const orderDetailsElement = document.getElementById('orderDetails');
    const payButton = document.getElementById('payButton');

    // Hide checkout section
    orderDetailsElement.style.display = 'none';
    payButton.style.display = 'none';

    // Display receipt details
    receiptElement.innerHTML = `
        <h2>Payment Receipt</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Payment ID:</strong> ${paymentResponse.razorpay_payment_id}</p>
        <p><strong>Amount Paid:</strong> ₹${totalAmount}</p>
        <button id="downloadReceipt">Download Receipt</button>
    `;
    receiptElement.style.display = 'block';

    // Add download functionality
    document.getElementById('downloadReceipt').addEventListener('click', function () {
        downloadReceipt(orderId, totalAmount, paymentResponse);
    });

    // Clear the cart after payment
    localStorage.removeItem('cart');
}

function downloadReceipt(orderId, totalAmount, paymentResponse) {
    const receiptContent = `
        Vedika Restaurant - Payment Receipt
        -----------------------------------
        Order ID: ${orderId}
        Payment ID: ${paymentResponse.razorpay_payment_id}
        Amount Paid: ₹${totalAmount}
        -----------------------------------
        Thank you for dining with us!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

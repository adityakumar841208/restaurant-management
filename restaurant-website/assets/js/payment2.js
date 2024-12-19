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
    document.getElementById('paymentForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const mobile = document.getElementById('mobile').value.trim();
        const address = document.getElementById('address').value;
        if (!mobile || !address) {
            alert('Please enter your mobile number');
            return;
        }

        // Pass order summary along with the total amount and mobile number
        initiatePayment(totalAmount, mobile, items, address);
    });
});

// Payment Initialization with backend handling using axios
async function initiatePayment(totalAmount, mobile, items, address) {
    try {
        const response = await axios.post('/create-payment', {
            amount: totalAmount, 
            mobile: mobile,
            address: address,
            orderSummary: items // Pass the order summary to the backend
        });

        const data = response.data;

        if (data.status === "success") {
            // Redirect user to the payment link
            window.location.href = data.paymentLink;
        } else {
            alert('Failed to create payment. Please try again.');
        }
    } catch (error) {
        console.error('Error during payment initialization:', error);
        alert('An error occurred. Please try again.');
    }
}

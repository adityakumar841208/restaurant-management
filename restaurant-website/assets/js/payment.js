// Function to handle form submission
document.getElementById('paymentForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const transactionId = document.getElementById('transactionId').value;
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const landmark = document.getElementById('landmark').value;
  const mobile = document.getElementById('mobile').value;
  const message = document.getElementById('message').value;

  // Retrieve the order items from localStorage
  const items = JSON.parse(localStorage.getItem('cart')) || [];

  // Basic validation
  if (!transactionId || !name || !address || !mobile || items.length === 0) {
      alert('Please fill out all required fields and add items to your order.');
      return;
  }

  // Store the form data in localStorage, excluding the transactionId
  localStorage.setItem('userName', name);
  localStorage.setItem('userAddress', address);
  localStorage.setItem('userLandmark', landmark);
  localStorage.setItem('userMobile', mobile);
  localStorage.setItem('userMessage', message);

  // Prepare data to send to the backend
  const orderData = {
      transactionId,
      name,
      address,
      landmark,
      mobile,
      message,
      items
  };

  try {
      // Send data to the backend
      const response = await fetch('/submit-payment', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
          alert('Payment details submitted successfully!');
          console.log("Order Summary:", result.orderSummary);
          // Clear the form and order data
          this.reset();
          localStorage.removeItem('cart'); // Clear cart after submission
          window.location.reload();
      } else {
          alert(result.message || 'Failed to submit payment details.');
      }
  } catch (error) {
      console.error('Error submitting payment:', error);
      alert('An error occurred while submitting the payment.');
  }
});

// Function to auto-fill form fields on page load
window.addEventListener('load', function() {
  // Retrieve the stored data from localStorage and display it
  if (localStorage.getItem('userName')) {
      document.getElementById('name').value = localStorage.getItem('userName');
  }
  if (localStorage.getItem('userAddress')) {
      document.getElementById('address').value = localStorage.getItem('userAddress');
  }
  if (localStorage.getItem('userLandmark')) {
      document.getElementById('landmark').value = localStorage.getItem('userLandmark');
  }
  if (localStorage.getItem('userMobile')) {
      document.getElementById('mobile').value = localStorage.getItem('userMobile');
  }
  if (localStorage.getItem('userMessage')) {
      document.getElementById('message').value = localStorage.getItem('userMessage');
  }

  // Display the order items and calculate the total
  const items = JSON.parse(localStorage.getItem('cart')) || [];
  let itemsHtml = '';
  let totalAmount = 0;

  items.forEach(item => {
      let itemPrice = item.price * item.quantity; // Calculate price based on quantity
      totalAmount += itemPrice;

      itemsHtml += `
          <div class="order-item">
              <p><strong>${item.name}</strong></p>
              <p>Category: ${item.category}</p>
              <p>Price: ₹${item.price}</p>
              <p>Quantity: ${item.quantity}</p>
              <p>Subtotal: ₹${itemPrice}</p>
          </div>
      `;
  });

  // Show items in the order summary section
  document.getElementById('orderDetails').innerHTML = `
      <h3>Order Summary:</h3>
      ${itemsHtml}
      <p><strong>Total Amount to Pay: ₹${totalAmount}</strong></p>
  `;
});

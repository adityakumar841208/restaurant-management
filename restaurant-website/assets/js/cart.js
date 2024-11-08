let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render cart items and calculate total price
function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");
    cartContainer.innerHTML = '';
    let totalPrice = 0;

    // Iterate over each cart item and create the HTML structure
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity-text">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <span class="price">₹${item.price * item.quantity}</span>
            <button onclick="removeItem(${item.id})" class="remove">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
        totalPrice += item.price * item.quantity;
    });

    // Update the total price display
    totalPriceEl.textContent = `Total Price: ₹${totalPrice}`;
    document.getElementById("proceed-payment").disabled = totalPrice === 0;
}

// Function to update item quantity in the cart and recalculate total price
function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change); // Ensure quantity doesn't go below 1
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); // Re-render to reflect the updated total price
    }
}

// Function to remove an item from the cart
function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Initialize cart rendering on page load
window.onload = renderCart;

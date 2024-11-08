const menuItems = [
    { id: 1, name: "Samosa", category: "snack", price: 20, description: "Classic Indian fried snack.", image: "../images/samosa.avif" },
    { id: 1, name: "Samosa", category: "snack", price: 20, description: "Classic Indian fried snack.", image: "../images/samosa.avif" },
    { id: 1, name: "Samosa", category: "snack", price: 20, description: "Classic Indian fried snack.", image: "../images/samosa.avif" },
    { id: 2, name: "Samosa", category: "snack", price: 20, description: "Classic Indian fried snack.", image: "../images/samosa.avif" },
    { id: 1, name: "Samosa", category: "snack", price: 20, description: "Classic Indian fried snack.", image: "../images/samosa.avif" },
    { id: 1, name: "Samosa", category: "snack", price: 20, description: "Classic Indian fried snack.", image: "../images/samosa.avif" }
    // Other items...
];
let cart = [];

function renderMenu() {
    const menuContainer = document.getElementById("menu-items");
    menuContainer.innerHTML = '';
    menuItems.forEach(item => {
        const menuCard = document.createElement("div");
        menuCard.className = "menu-card";
        menuCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="price">₹${item.price}</span>
            <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuContainer.appendChild(menuCard);
    });
}

function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const existingItem = cart.find(i => i.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to the cart and show popup
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    const existingItem = cart.find(i => i.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showPopup("Item added to cart!");
}

// Show popup message function
function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.classList.add("show");

    // Hide the popup after 2 seconds
    setTimeout(() => {
        popup.classList.remove("show");
    }, 2000);
}

window.onload = () => {
    renderMenu();
    cart = JSON.parse(localStorage.getItem('cart')) || [];
};

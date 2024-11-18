const menuItems = [
    { id: 1, name: "Samosa (1 Piece)", category: "Snacks", halfPlate: 10, fullPlate: null, description: "Classic Indian fried snack.", image: "../images/samosa.avif" },
    { id: 2, name: "Samosa Chole (1 Piece)", category: "Snacks", halfPlate: null, fullPlate: 20, description: "Samosa served with spiced chickpea curry.", image: "../images/samosachole.jpg" },
    { id: 3, name: "Samosa Pav", category: "Snacks", halfPlate: 30, fullPlate: 60, description: "Samosa served with pav bread.", image: "../images/samosapav.jpg" },
    { id: 4, name: "Aloo Bhajia Pav", category: "Snacks", halfPlate: 30, fullPlate: 60, description: "Crispy potato fritters with pav bread.", image: "../images/bhajiyapav.jpg" },
    { id: 5, name: "Vada Pav (1 Piece)", category: "Snacks", halfPlate: null, fullPlate: 20, description: "Popular Mumbai street food with spicy potato patty.", image: "../images/vadapav.jpg" },
    { id: 6, name: "Butter Vada Pav (1 Pc)", category: "Snacks", halfPlate: null, fullPlate: 40, description: "Classic vada pav with butter.", image: "../images/buttervadapav.webp" },
    { id: 7, name: "Schezwan Butter Vada Pav (1 Pc)", category: "Snacks", halfPlate: null, fullPlate: 50, description: "Spicy schezwan butter vada pav.", image: "../images/schezwanvadapav.jpg" },
    { id: 8, name: "Cheese Vada Pav (1 Pc)", category: "Snacks", halfPlate: null, fullPlate: 60, description: "Vada pav with melted cheese.", image: "../images/cheesevadapav.jpg" },
    { id: 9, name: "CheeseBurst Vada Pav (1 Pc)", category: "Snacks", halfPlate: null, fullPlate: 70, description: "Cheese-filled vada pav.", image: "../images/cheeseburstvadapav.webp" },
    { id: 10, name: "Paneer Vada Pav (1 Pc)", category: "Snacks", halfPlate: null, fullPlate: 80, description: "Vada pav with spiced paneer.", image: "../images/paneervadapav.webp" },
    { id: 11, name: "French Fries (Finger Chips)", category: "Snacks", halfPlate: null, fullPlate: 90, description: "Crispy golden potato fries.", image: "../images/frenchfries.jpg" },
    { id: 12, name: "Cheese French Fries (Finger Chips)", category: "Snacks", halfPlate: null, fullPlate: 100, description: "French fries topped with cheese.", image: "../images/cheesefrenchfries.jpg" },
    { id: 13, name: "Mayonise French Fries (Finger Chips)", category: "Snacks", halfPlate: null, fullPlate: 110, description: "French fries with mayonnaise.", image: "../images/mayonnaisefrenchfries.avif" },
    { id: 14, name: "Bun Maska (1 Piece)", category: "Snacks", halfPlate: null, fullPlate: 40, description: "Soft bun with butter.", image: "../images/bunmaska.jpg" },
    { id: 15, name: "Plain Maggi", category: "Noodles", halfPlate: null, fullPlate: 60, description: "Classic Maggi noodles with spices.", image: "../images/maggi.jpg" },
    { id: 16, name: "Vegetables Maggi", category: "Noodles", halfPlate: null, fullPlate: 90, description: "Maggi noodles with vegetables.", image: "../images/vegetablemaggi.jpg" },
    { id: 17, name: "Butter Maggi", category: "Noodles", halfPlate: null, fullPlate: 70, description: "Maggi noodles with butter.", image: "../images/buttermaggi.webp" },
    { id: 18, name: "Cheese Maggi", category: "Noodles", halfPlate: null, fullPlate: 120, description: "Maggi noodles with cheese.", image: "../images/cheesemaggi.webp" },
    { id: 19, name: "Veg Chowmein", category: "Noodles", halfPlate: 30, fullPlate: 50, description: "Stir-fried noodles with mixed vegetables.", image: "../images/vegchowmin.webp" },
    { id: 20, name: "Paneer Chowmein", category: "Noodles", halfPlate: 50, fullPlate: 100, description: "Stir-fried noodles with paneer cubes.", image: "../images/paneerchowmin.jpg" },
    { id: 21, name: "Chhole Bhature", category: "Meals", halfPlate: 30, fullPlate: 50, description: "Chickpea curry served with fried bread.", image: "../images/cholebhature.jpg" },
    { id: 22, name: "Aloo Paratha (1 Piece)", category: "Paratha", halfPlate: null, fullPlate: 80, description: "Flatbread stuffed with spiced potatoes.", image: "../images/alooparatha.jpg" },
    { id: 23, name: "Mix Paratha (1 Piece)", category: "Paratha", halfPlate: null, fullPlate: 80, description: "Flatbread with mixed vegetable filling.", image: "../images/mixparatha.jpg" },
    { id: 24, name: "Paneer Paratha (1 Piece)", category: "Paratha", halfPlate: null, fullPlate: 120, description: "Flatbread stuffed with spiced paneer.", image: "../images/paneerparatha.jpg" },
    { id: 25, name: "Mix Pakoda (8 Pieces)", category: "Snacks", halfPlate: null, fullPlate: 100, description: "Assorted deep-fried fritters.", image: "../images/mixpakoda.jpg" },
    { id: 26, name: "Aloo Pakoda", category: "Snacks", halfPlate: null, fullPlate: 100, description: "Potato fritters.", image: "../images/aloopakoda.webp" },
    { id: 27, name: "Onion Pakoda (8 Pieces)", category: "Snacks", halfPlate: null, fullPlate: 100, description: "Deep-fried onion fritters.", image: "../images/onionpakoda.jpg" },
    { id: 28, name: "Paneer Pakoda (6 Pieces)", category: "Snacks", halfPlate: null, fullPlate: 120, description: "Deep-fried paneer fritters.", image: "../images/paneerpakoda.jpg" },
    { id: 29, name: "Jalebi (1kg)", category: "Desserts", halfPlate: null, fullPlate: 200, description: "Sweet, crispy fried spirals.", image: "../images/jalebi.jpg" },
    { id: 30, name: "Cold drinks", category: "Beverages", halfPlate: null, fullPlate: null, description: "Chilled cold drink (various flavors).", image: "../images/cold_drink.jpg" },
    { id: 31, name: "Tea", category: "Beverages", halfPlate: 10, fullPlate: 15, description: "Hot Indian tea with milk.", image: "../images/chai.jpg" },
    { id: 32, name: "Coffee", category: "Beverages", halfPlate: 15, fullPlate: 20, description: "Hot brewed coffee.", image: "../images/coffee.jpg" },
    { id: 33, name: "Cold Coffee", category: "Beverages", halfPlate: null, fullPlate: 100, description: "Chilled coffee with milk and sugar.", image: "../images/coldcoffee.jpg" },
    { id: 34, name: "Water Bottle (1 Liter)", category: "Beverages", halfPlate: null, fullPlate: 20, description: "1-liter bottled water.", image: "../images/water.webp" },
    { id: 35, name: "Barfi / Mithai (1kg)", category: "Desserts", halfPlate: null, fullPlate: 600, description: "Assorted Indian sweets.", image: "../images/barfimithai.jpg" },
    { id: 36, name: "Dahi (Curd) (1kg)", category: "Dairy", halfPlate: null, fullPlate: 200, description: "Fresh yogurt.", image: "../images/dahi.jpg" },
    { id: 37, name: "Rasgulla / Gulab Jamun (1pc)", category: "Desserts", halfPlate: null, fullPlate: 30, description: "Soft and syrupy Indian sweet.", image: "../images/gulabjamun.jpg" },
    { id: 38, name: "Namkeen / Namak Para / Etc (1kg)", category: "Snacks", halfPlate: null, fullPlate: 300, description: "Savory fried snacks.", image: "../images/namkeen.jpg" }
];




let cart = [];
let filteredMenuItems = [...menuItems];

function renderMenu() {
    const menuContainer = document.getElementById("menu-items");
    menuContainer.innerHTML = '';
    filteredMenuItems.forEach(item => {
        let priceText = '';
        let plateSelector = '';

        if (item.halfPlate && item.fullPlate) {
            priceText = `Half: ₹${item.halfPlate} | Full: ₹${item.fullPlate}`;
            plateSelector = `
                <select id="plate-choice-${item.id}" class="plate-choice">
                    <option value="half">Half Plate - ₹${item.halfPlate}</option>
                    <option value="full">Full Plate - ₹${item.fullPlate}</option>
                </select>`;
        } else if (item.halfPlate) {
            priceText = `₹${item.halfPlate}`;
        } else if (item.fullPlate) {
            priceText = `₹${item.fullPlate}`;
        } else {
            priceText = 'Price not available';
            plateSelector = `<span>${priceText}</span>`;
        }

        const menuCard = document.createElement("div");
        menuCard.className = "menu-card";
        menuCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="price">${priceText}</span>
            ${plateSelector}
            <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuContainer.appendChild(menuCard);
    });
}

function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    let plateType = null;
    let price;

    // Only get the selected plate choice if both half and full are available
    const plateChoice = document.getElementById(`plate-choice-${id}`);
    if (plateChoice) {
        plateType = plateChoice.value;
        price = plateType === "half" ? item.halfPlate : item.fullPlate;
    } else {
        // If there's no dropdown, use the only available price
        price = item.halfPlate || item.fullPlate;
    }

    // Add to cart without plateType if there's only one price option
    const existingItem = cart.find(i => i.id === id && i.plateType === plateType);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const cartItem = { ...item, quantity: 1, price };
        if (plateType) {
            cartItem.plateType = plateType;
        }
        cart.push(cartItem);
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

// Filter items by category
function filterByCategory(category) {
    if (category === 'all') {
        filteredMenuItems = [...menuItems];
    } else {
        filteredMenuItems = menuItems.filter(item => item.category === category);
    }
    renderMenu();
}

// Sort items by selected option
function sortItems(sortOption) {
    if (sortOption === 'price-low') {
        filteredMenuItems.sort((a, b) => (a.fullPlate || a.halfPlate) - (b.fullPlate || b.halfPlate));
    } else if (sortOption === 'price-high') {
        filteredMenuItems.sort((a, b) => (b.fullPlate || b.halfPlate) - (a.fullPlate || a.halfPlate));
    } else if (sortOption === 'default') {
        filteredMenuItems = [...menuItems];
    }
    renderMenu();
}


// This function will filter the menu items based on the search term
function searchMenu() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();

    if (searchTerm === "") {
        // If the search bar is empty, show all items
        filteredMenuItems = [...menuItems];
    } else {
        // Filter items based on the search term (case-insensitive)
        filteredMenuItems = menuItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
    }

    renderMenu();
}

// Modify the renderMenu function to ensure it uses the filtered items after searching
function renderMenu() {
    const menuContainer = document.getElementById("menu-items");
    menuContainer.innerHTML = ''; // Clear previous menu items
    filteredMenuItems.forEach(item => {
        let priceText = '';
        let plateSelector = '';

        if (item.halfPlate && item.fullPlate) {
            priceText = `Half: ₹${item.halfPlate} | Full: ₹${item.fullPlate}`;
            plateSelector = ` 
                <select id="plate-choice-${item.id}" class="plate-choice">
                    <option value="half">Half Plate - ₹${item.halfPlate}</option>
                    <option value="full">Full Plate - ₹${item.fullPlate}</option>
                </select>`;
        } else if (item.halfPlate) {
            priceText = `₹${item.halfPlate}`;
        } else if (item.fullPlate) {
            priceText = `₹${item.fullPlate}`;
        } else {
            priceText = 'Price not available';
            plateSelector = `<span>${priceText}</span>`;
        }

        const menuCard = document.createElement("div");
        menuCard.className = "menu-card";
        menuCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="price">${priceText}</span>
            ${plateSelector}
            <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuContainer.appendChild(menuCard);
    });
}



window.onload = () => {
    renderMenu();
    cart = JSON.parse(localStorage.getItem('cart')) || [];
};

const menuItems = [
    { id: 1, name: "Samosa (1 Piece)", category: "Snacks", halfPlate: 10, fullPlate: null, description: "Classic Indian fried snack.", image: "../images/samosa.avif" },
    { id: 2, name: "Samosa Chole (1 Piece)", category: "Snacks", halfPlate: null, fullPlate: 20, description: "Samosa served with spiced chickpea curry.", image: "../images/samosachole.jpg" },
    { id: 3, name: "Vada Pav (1 Piece)", category: "Snacks", halfPlate: null, fullPlate: 20, description: "Popular Mumbai street food with spicy potato patty.", image: "../images/vadapav.jpg" },
    { id: 4, name: "Pani Puri (5 Pieces)", category: "Snacks", halfPlate: null, fullPlate: 20, description: "Crispy puris filled with spicy and tangy water.", image: "../images/panipuri.jpg" },
    { id: 5, name: "Bun Maska (1 Piece)", category: "Snacks", halfPlate: null, fullPlate: 20, description: "Soft bun with butter.", image: "../images/bunmaska.jpg" },
    { id: 6, name: "Tikki", category: "Snacks", halfPlate: 25, fullPlate: 50, description: "Crispy spiced potato patty.", image: "../images/tikki.jpg" },
    { id: 7, name: "Maggi", category: "Noodles", halfPlate: null, fullPlate: 40, description: "Classic Maggi noodles with spices.", image: "../images/maggi.jpg" },
    { id: 8, name: "Veg Chowmein", category: "Noodles", halfPlate: 30, fullPlate: 50, description: "Stir-fried noodles with mixed vegetables.", image: "../images/vegchowmin.webp" },
    { id: 9, name: "Chole Bhature", category: "Meals", halfPlate: 30, fullPlate: 50, description: "Chickpea curry served with fried bread.", image: "../images/cholebhature.jpg" },
    { id: 10, name: "Paneer Chowmein", category: "Noodles", halfPlate: 50, fullPlate: 100, description: "Stir-fried noodles with paneer cubes.", image: "../images/paneerchowmin.jpg" },
    { id: 11, name: "Aloo Paratha (1 Piece)", category: "Paratha", halfPlate: null, fullPlate: 40, description: "Flatbread stuffed with spiced potatoes.", image: "../images/alooparatha.jpg" },
    { id: 12, name: "Mix Paratha (1 Piece)", category: "Paratha", halfPlate: null, fullPlate: 40, description: "Flatbread with mixed vegetable filling.", image: "../images/mixparatha.jpg" },
    { id: 13, name: "Paneer Paratha (1 Piece)", category: "Paratha", halfPlate: null, fullPlate: 70, description: "Flatbread stuffed with spiced paneer.", image: "../images/paneerparatha.jpg" },
    { id: 14, name: "Paneer Pakoda (6 Pieces)", category: "Snacks", halfPlate: null, fullPlate: 60, description: "Deep-fried paneer fritters.", image: "../images/paneerpakoda.jpg" },
    { id: 15, name: "Onion Pakoda (8 Pieces)", category: "Snacks", halfPlate: null, fullPlate: 40, description: "Deep-fried onion fritters.", image: "../images/onionpakoda.jpg" },
    { id: 16, name: "Chai", category: "Beverages", halfPlate: 10, fullPlate: 15, description: "Hot Indian tea with milk.", image: "../images/chai.jpg" },
    { id: 17, name: "Coffee", category: "Beverages", halfPlate: 15, fullPlate: 20, description: "Hot brewed coffee.", image: "../images/coffee.jpg" },
    { id: 18, name: "Water Bottle (1 Liter)", category: "Beverages", halfPlate: null, fullPlate: 20, description: "1-liter bottled water.", image: "../images/water.webp" },
    { id: 19, name: "Jaljeera (1 kg)", category: "Beverages", halfPlate: null, fullPlate: 20, description: "Refreshing spiced drink.", image: "../images/jaljeera.jpg" },
    { id: 20, name: "Cold Drink", category: "Beverages", halfPlate: null, fullPlate: 120, description: "Chilled cold drink (various flavors).", image: "../images/cold_drink.jpg" },
    { id: 21, name: "Rajma Chawal", category: "Meals", halfPlate: 30, fullPlate: 50, description: "Kidney beans curry with rice.", image: "../images/rajmachawal.jpg" },
    { id: 22, name: "Kadhi Chawal", category: "Meals", halfPlate: 30, fullPlate: 50, description: "Yogurt-based curry with rice.", image: "../images/kadhichawal.jpg" },
    { id: 23, name: "Dal Chawal", category: "Meals", halfPlate: 30, fullPlate: 50, description: "Lentil curry with rice.", image: "../images/dalchawal.jpg" },
    { id: 24, name: "Thali", category: "Meals", halfPlate: 70, fullPlate: 120, description: "Indian meal platter with various dishes.", image: "../images/meal.avif" },
    { id: 25, name: "Puri Sabzi", category: "Meals", halfPlate: 30, fullPlate: 50, description: "Fried bread with vegetable curry.", image: "../images/purisabzi.avif" },
    { id: 26, name: "Masala Dosa", category: "South Indian", halfPlate: 40, fullPlate: 60, description: "Crispy rice crepe with potato filling.", image: "../images/masaladosa.jpg" },
    { id: 27, name: "Idli Sambar", category: "South Indian", halfPlate: 30, fullPlate: 50, description: "Steamed rice cakes with lentil soup.", image: "../images/idlisambhar.jpg" },
    { id: 28, name: "Vada Sambar", category: "South Indian", halfPlate: 30, fullPlate: 50, description: "Fried lentil donuts with sambar.", image: "../images/vadasambhar.avif" },
    { id: 29, name: "Paneer Tikka", category: "Snacks", halfPlate: 50, fullPlate: 100, description: "Spiced and grilled paneer.", image: "../images/paneertikka.avif" },
    { id: 30, name: "Chicken Biryani", category: "Non-Veg", halfPlate: 60, fullPlate: 100, description: "Aromatic rice with spiced chicken.", image: "../images/chickenbiryani.jpg" },
    { id: 31, name: "Egg Curry", category: "Non-Veg", halfPlate: 40, fullPlate: 70, description: "Spiced curry with boiled eggs.", image: "../images/eggcurry.jpg" },
    { id: 32, name: "Egg Bhurji", category: "Non-Veg", halfPlate: 30, fullPlate: 50, description: "Scrambled spiced eggs.", image: "../images/eggbhurji.jpg" },
    { id: 33, name: "Mutton Curry", category: "Non-Veg", halfPlate: 70, fullPlate: 120, description: "Rich and spiced mutton curry.", image: "../images/muttoncurry.jpg" },
    { id: 34, name: "Veg Biryani", category: "Meals", halfPlate: 40, fullPlate: 70, description: "Aromatic rice with vegetables.", image: "../images/vegbiryani.jpg" },
    { id: 35, name: "Paneer Butter Masala", category: "Meals", halfPlate: 50, fullPlate: 90, description: "Rich paneer curry in buttery tomato sauce.", image: "../images/paneerbuttermasala.jpg" },
    { id: 36, name: "Mix Veg Curry", category: "Meals", halfPlate: 40, fullPlate: 70, description: "Spiced curry with mixed vegetables.", image: "../images/mixvegcurry.jpg" },
    { id: 37, name: "Roti (2 Pieces)", category: "Bread", halfPlate: 10, fullPlate: null, description: "Whole wheat flatbread.", image: "../images/roti.jpg" }
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
    }else if(sortOption === 'default'){
        filteredMenuItems = [...menuItems];
    }
    renderMenu();
}


window.onload = () => {
    renderMenu();
    cart = JSON.parse(localStorage.getItem('cart')) || [];
};

// filtering and sorting functionality
document.getElementById("filter").addEventListener("change", filterMenu);
document.getElementById("sort").addEventListener("change", sortMenu);

function filterMenu() {
    const filterValue = document.getElementById("filter").value;
    const menuItems = document.querySelectorAll(".menu-card");

    menuItems.forEach(item => {
        if (filterValue === "all" || item.dataset.category === filterValue) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function sortMenu() {
    const sortValue = document.getElementById("sort").value;
    const menuContainer = document.getElementById("menu-items");
    const menuItems = Array.from(document.querySelectorAll(".menu-card"));

    menuItems.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);

        if (sortValue === "price-low") return priceA - priceB;
        if (sortValue === "price-high") return priceB - priceA;
        return 0;
    });

    menuContainer.innerHTML = "";
    menuItems.forEach(item => menuContainer.appendChild(item));
}
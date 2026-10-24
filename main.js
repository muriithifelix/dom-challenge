
document.addEventListener("DOMContentLoaded", () => {
    // Get HTML elements
    const itemInput = document.getElementById("item");
    const priceInput = document.getElementById("price");
    const shoppingList = document.getElementById("shoppingList");
    const addButton = document.querySelector(".addBtn");
    const markPurchasedButton = document.querySelector(".markPurchasedBtn");
    const clearListButton = document.querySelector(".clearListBtn");

    // Store shopping items
    let items = JSON.parse(localStorage.getItem("shoppingList")) || [];

    // Track the item currently being edited
    let editingId = null;

    // Save items to localStorage
    function saveItems() {
        localStorage.setItem("shoppingList", JSON.stringify(items));
    }

    // Format prices to two decimal places
    function formatPrice(price) {
        return Number(price).toFixed(2);
    }

    // Update the total cost display
    function updateTotal() {
        const total = items.reduce((sum, item) => {
            return sum + (item.purchased ? Number(item.price) : 0);
        }, 0);

        let totalElement = document.getElementById("totalCost");

        // Create the total display if it doesn't exist
        if (!totalElement) {
            totalElement = document.createElement("p");
            totalElement.id = "totalCost";
            shoppingList.parentElement.appendChild(totalElement);
        }

        totalElement.textContent =
            `Purchased total: ${formatPrice(total)}`;
    }

    // Render the shopping list
    function renderList() {
        shoppingList.innerHTML = "";

        items.forEach((item) => {
            const li = document.createElement("li");
            li.dataset.id = item.id;

            // Item name
            const name = document.createElement("span");
            name.textContent = item.name;

            // Item price
            const price = document.createElement("span");
            price.textContent = ` - ${formatPrice(item.price)}`;

            // Purchased styling
            if (item.purchased) {
                name.style.textDecoration = "line-through";
                name.style.color = "gray";
                price.style.textDecoration = "line-through";
                li.style.backgroundColor = "#e0f2e9";
            }

            // Select an item by clicking its row
            li.addEventListener("click", (event) => {
                if (event.target.closest("button")) return;

                li.classList.toggle("selected");
            });

            // Edit button
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", () => {
                itemInput.value = item.name;
                priceInput.value = item.price;
                editingId = item.id;
                addButton.textContent = "Save Changes";
                itemInput.focus();
            });

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", () => {
                items = items.filter((entry) => entry.id !== item.id);

                if (editingId === item.id) {
                    resetForm();
                }

                saveItems();
                renderList();
            });

            // Add elements to the list item
            li.append(name, price, editButton, deleteButton);
            shoppingList.appendChild(li);
        });

        updateTotal();
    }

    // Reset the input fields and editing state
    function resetForm() {
        itemInput.value = "";
        priceInput.value = "";
        editingId = null;
        addButton.textContent = "Add";
    }

    // Add a new item or save an edit
    function addOrUpdateItem() {
        const name = itemInput.value.trim();
        const priceText = priceInput.value.trim();
        const price = Number(priceText);

        if (!name) {
            alert("Please enter an item name.");
            itemInput.focus();
            return;
        }

        if (
            priceText === "" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            alert("Please enter a valid, non-negative price.");
            priceInput.focus();
            return;
        }

        if (editingId !== null) {
            // Update an existing item
            const item = items.find((entry) => entry.id === editingId);

            if (item) {
                item.name = name;
                item.price = price;
            }
        } else {
            // Add a new item
            items.push({
                id: `${Date.now()}-${Math.random()}`,
                name: name,
                price: price,
                purchased: false
            });
        }

        saveItems();
        resetForm();
        renderList();
        itemInput.focus();
    }

    // Mark selected items as purchased.
    // If none are selected, mark all items as purchased.
    function markPurchased() {
        const selectedIds = Array.from(
            shoppingList.querySelectorAll("li.selected")
        ).map((li) => li.dataset.id);

        if (selectedIds.length > 0) {
            items.forEach((item) => {
                if (selectedIds.includes(String(item.id))) {
                    item.purchased = true;
                }
            });
        } else {
            items.forEach((item) => {
                item.purchased = true;
            });
        }

        saveItems();
        renderList();
    }

    // Clear the complete shopping list
    function clearList() {
        if (items.length === 0) {
            alert("Your shopping list is already empty.");
            return;
        }

        const confirmed = confirm(
            "Are you sure you want to clear the entire shopping list?"
        );

        if (!confirmed) return;

        items = [];
        resetForm();
        saveItems();
        renderList();
    }

    // Event listeners
    addButton.addEventListener("click", addOrUpdateItem);
    markPurchasedButton.addEventListener("click", markPurchased);
    clearListButton.addEventListener("click", clearList);

    // Allow Enter to add or update an item
    [itemInput, priceInput].forEach((input) => {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                addOrUpdateItem();
            }
        });
    });

    // Load and display saved items
    renderList();
});
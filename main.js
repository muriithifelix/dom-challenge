const addBtn = document.querySelector('.addBtn');
const markPurchasedBtn = document.querySelector('.markPurchasedBtn');
const clearListBtn = document.querySelector('.clearListBtn');
const itemInput = document.getElementById('item');
const priceInput = document.getElementById('price');
const listContainer = document.getElementById('listContainer');

addBtn.addEventListener('click', () => {
    const itemValue = itemInput.value.trim();
    const priceValue = priceInput.value.trim();

    if (itemValue && priceValue) {
        const listItem = document.createElement('totalCost');
        listItem.className = 'list-item';
        listItem.innerHTML = `<span>${itemValue} - $${priceValue}</span>`;
        listContainer.appendChild(listItem);

        itemInput.value = '';
        priceInput.value = '';
    }
}   
);

markPurchasedBtn.addEventListener('click', () => {
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(item => {
        item.classList.toggle('purchased');
    });
});

clearListBtn.addEventListener('click', () => {
    listContainer.innerHTML = '';
}); 
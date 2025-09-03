// Array of products
const products = [{
    name: "Product 1",
    price: 10.99,
    image: "https://via.placeholder.com/50"
}, {
    name: "Product 2",
    price: 15.49,
    image: "https://via.placeholder.com/50"
}, {
    name: "Product 3",
    price: 7.99,
    image: "https://via.placeholder.com/50"
}];

// Get the container element
const productContainer = document.getElementById('product-container');
const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productImageInput = document.getElementById('product-image');

// Function to render products
function renderProducts() {
    productContainer.innerHTML = ''; // Clear the container
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <span class="product-name">${product.name}</span>
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <span class="remove-btn" data-index="${index}">[Remove]</span>
        `;

        productContainer.appendChild(productDiv);
    });

    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            products.splice(index, 1); // Remove product from array
            renderProducts(); // Re-render the product list
        });
    });
}

// Handle form submission to add a product
productForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const image = productImageInput.value.trim();

    if (name && !isNaN(price) && image) {
        products.push({
            name,
            price,
            image
        }); // Add new product to array
        renderProducts(); // Re-render the product list
        productForm.reset(); // Clear the form
    }
});

// Initial render
renderProducts();
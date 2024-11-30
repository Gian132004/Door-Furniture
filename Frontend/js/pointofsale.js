document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    } else {
        console.error('Checkout button not found.');
    }
});

let cart = [];

// Fetch all products from the backend API
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5500/api/products/all');
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load products');
    }
}

// Display products in the DOM
function displayProducts(products) {
    const productList = document.querySelector('.product-list .row');
    if (!productList) {
        console.error('Product list container not found.');
        return;
    }

    productList.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', 'col-md-4');

        productCard.innerHTML = `
            <div class="card shadow-sm">
                <img src="http://localhost:5500/images/${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">Price: Php ${product.price}</p>
                    <p class="card-text">Stock: ${product.stock}</p>
                    <button class="btn btn-primary add-product" 
                            data-id="${product._id}" 
                            data-name="${product.title}" 
                            data-price="${product.price}" 
                            data-stock="${product.stock}">
                        Add Product
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });

    // Add event listeners to "Add Product" buttons
    document.querySelectorAll('.add-product').forEach(button => {
        button.addEventListener('click', addProductToCart);
    });
}

// Add product to the cart
function addProductToCart(e) {
    const button = e.target;
    const productId = button.dataset.id;
    const productName = button.dataset.name;
    const productPrice = parseFloat(button.dataset.price);
    let productStock = parseInt(button.dataset.stock);

    if (productStock <= 0) {
        alert(`Product "${productName}" is out of stock.`);
        return;
    }

    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        if (existingProduct.quantity < productStock) {
            existingProduct.quantity++;
        } else {
            alert(`Only ${productStock} units available for "${productName}".`);
            return;
        }
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1,
            stock: productStock
        });
    }

    renderCart();
}

// Render cart in the current product section
function renderCart() {
    const cartList = document.getElementById('current-product-list');
    const totalAmount = document.getElementById('total-amount');

    if (!cartList || !totalAmount) {
        console.error('Cart or total amount element not found.');
        return;
    }

    cartList.innerHTML = ''; // Clear previous cart
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');
        cartItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>Php ${item.price * item.quantity}</span>
        `;
        cartList.appendChild(cartItem);
    });

    totalAmount.textContent = `Php ${total.toFixed(2)}`;
}

// Checkout and display a receipt
async function checkout() {
    if (cart.length === 0) {
        alert('Cart is empty. Please add products.');
        return;
    }

    const receipt = cart.map(item => {
        return `${item.name} x${item.quantity} - Php ${item.price * item.quantity}`;
    }).join('\n');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Receipt:\n${receipt}\n\nTotal: Php ${total.toFixed(2)}`);

    try {
        for (const item of cart) {
            await fetch(`http://localhost:5500/api/products/update-stock/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: item.quantity })
            });
        }

        cart = [];
        renderCart();
        fetchProducts();
        alert('Checkout successful!');
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Failed to process checkout');
    }
}

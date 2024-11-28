// Fetch and display products
const fetchProducts = async () => {
    try {
        const response = await fetch('http://localhost:5500/api/products');
        const products = await response.json();

        const productsContainer = document.querySelector('.d-flex.flex-wrap');
        productsContainer.innerHTML = '';

        products.forEach(product => {
            productsContainer.innerHTML += `
                <div class="product-card card" style="margin: 10px; width: 16rem;">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">Stocks: ${product.stock}</p>
                        <a href="#" class="btn btn-warning editBtn" 
                           data-bs-toggle="modal" 
                           data-bs-target="#editProductModal" 
                           data-product-id="${product._id}" 
                           data-product-title="${product.title}" 
                           data-product-stock="${product.stock}" 
                           data-product-image="${product.image}">
                           Edit
                        </a>
                        <button class="btn btn-danger deleteBtn" data-product-id="${product._id}">Delete</button>
                    </div>
                </div>`;
        });

        addEventListeners();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Upload image to the server
const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch('http://localhost:5500/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            return result.imageUrl; // Assuming the server returns the uploaded image's URL
        } else {
            throw new Error('Image upload failed');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};

const addProduct = async (event) => {
    event.preventDefault();
    const form = document.getElementById('addProductForm');
    const formData = new FormData(form);  // FormData will automatically handle file uploads

    try {
        const response = await fetch('http://localhost:5500/api/products/new', {
            method: 'POST',
            body: formData,  // Send the FormData directly, no need to stringify it
        });

        if (response.ok) {
            alert('Product added successfully!');
            form.reset();
            fetchProducts();  // Refresh the list of products
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error || 'Failed to add product'}`);
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
};


// Edit a product
const editProduct = async (event) => {
    event.preventDefault();
    const form = document.getElementById('editProductForm');
    const productId = form.dataset.productId;

    const data = {
        title: document.getElementById('editProductTitle').value,
        stock: document.getElementById('editProductStock').value,
    };

    try {
        const response = await fetch(`http://localhost:5500/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Product updated successfully!');
            fetchProducts();
        } else {
            alert('Failed to update product.');
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
};

// Delete a product
const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`http://localhost:5500/api/products/${productId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Product deleted successfully!');
            fetchProducts();
        } else {
            alert('Failed to delete product.');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

// Add event listeners for edit and delete buttons
const addEventListeners = () => {
    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const productTitle = button.dataset.productTitle;
            const productStock = button.dataset.productStock;

            const form = document.getElementById('editProductForm');
            form.dataset.productId = productId;

            document.getElementById('editProductTitle').value = productTitle;
            document.getElementById('editProductStock').value = productStock;
        });
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            if (confirm('Are you sure you want to delete this product?')) {
                deleteProduct(productId);
            }
        });
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    document.getElementById('addProductForm').addEventListener('submit', addProduct);
    document.getElementById('editProductForm').addEventListener('submit', editProduct);
});

const multer = require('multer');
const upload = multer({ dest: 'public/images/' }); // Configure storage path for image uploads

const Product = require('../models/productModel'); // Import the Product model

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
    const { title, stock, price } = req.body;
    const image = req.file?.path; // Get the file path from the upload

    try {
        const newProduct = new Product({
            title,
            stock,
            price,
            image, // Save the file path in your product data
        });

        await newProduct.save(); // Save the new product
        res.status(201).json(newProduct);  // Return the created product as a response
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error: error.message });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, stock, price } = req.body;
    const image = req.file?.path; // Get image from form data if uploaded

    try {
        const updates = { title, stock, price };
        if (image) {
            updates.image = image; // Include image if it's provided
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

// Export the controller functions
module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};

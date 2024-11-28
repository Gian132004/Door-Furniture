const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/productModel');

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: './uploads/', // Folder to store the uploaded files
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Naming the file with a timestamp
    },
});

// Initialize Multer with the storage configuration
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    },
}).single('image'); // Expecting the image field in the form to be named 'image'

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Add a new product with image upload
router.post('/new', upload, async (req, res) => {
    const { title, price, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : ''; // Save the image URL

    try {
        const newProduct = new Product({ title, price, stock, image });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.json({ message: 'Product deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

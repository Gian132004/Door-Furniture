const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/'); // Folder where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
  }
});

const upload = multer({ storage: storage });


// Route to get all products
router.get('/all', getAllProducts);

// Route to create a new product with image upload
router.post('/create', upload.single('productImage'), createProduct); // 'productImage' is the field name for the file

// Route to update an existing product
router.put('/update/:id', upload.single('productImage'), updateProduct);

// Route to delete a product
router.delete('/delete/:id', deleteProduct);

module.exports = router;

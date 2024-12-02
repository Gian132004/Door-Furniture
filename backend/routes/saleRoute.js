const express = require("express");
const router = express.Router();
const { createSale, getSales } = require("../controllers/saleController");

// POST - Create a sale
router.post("/create", createSale);

// GET - Retrieve all sales
router.get("/all", getSales);

module.exports = router;

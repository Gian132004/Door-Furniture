const express = require('express');
const login = require('../models/loginmodel')

const router = express.Router();

// GET all workouts
router.get('/', (req, res) => {
    res.json({ mssg: 'get all workouts' });
});

// GET a specific workout by ID
router.get('/:id', (req, res) => {
    res.json({ mssg: 'get workout with Id' });
}); 

// POST a new workout'
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const newlogin = await login.create({ username, password });
        res.status(200).json(newlogin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// PATCH to update a specific workout by ID
router.delete('/:id', (req, res) => {
    res.json({ mssg: 'delete workout with ID'});
});

// PATCH to update a specific workout by ID
router.patch('/:id', (req, res) => {
    res.json({ mssg: 'update workout with ID'});
});

module.exports = router;
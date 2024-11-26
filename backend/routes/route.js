const express = require('express');
const {
    createuser,
} = require('../controllers/logincontroler')
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
router.post('/', createuser)


// PATCH to update a specific workout by ID
router.delete('/:id', (req, res) => {
    res.json({ mssg: 'delete workout with ID'});
});

// PATCH to update a specific workout by ID
router.patch('/:id', (req, res) => {
    res.json({ mssg: 'update workout with ID'});
});

module.exports = router;
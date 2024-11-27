require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const sysroute = require('./routes/route');

// Create Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Serve static files from the Frontend folder
app.use(express.static(path.join(__dirname, 'Frontend')));

// Routes
app.use('/api/route', sysroute);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        // Start the server on the specified port
        app.listen(process.env.PORT, () => {
            console.log('Server listening on port', process.env.PORT);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sysroute = require('./routes/route');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/route', sysroute);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        console.log('Server is running on port', process.env.PORT);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


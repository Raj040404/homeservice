const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (without deprecated options)
mongoose.connect('mongodb://localhost:27017/raj')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


// Define User Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    email: { 
        type: String, 
        unique: true // This ensures uniqueness
    },
    password: String,
});

const User = mongoose.model('User', userSchema);

// Register route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Received registration data:', req.body);  // Log incoming data

    try {
        // Check for existing user by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already exists:', email);  // Log if email already exists
            return res.status(400).json({ message: 'Email already exists!' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);  // Log the error
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
});


// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with:', { email, password });  // Log email and password

        const user = await User.findOne({ email, password });

        if (user) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Login failed', error });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});

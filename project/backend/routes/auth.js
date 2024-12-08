// src/routes/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as needed
const router = express.Router();
const bcrypt = require('bcrypt');

// Helper function for validation
const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
};

const validatePassword = (password) => {
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasSpecialChar = /[\W_]/;
    return (
        password.length >= 6 &&
        hasNumber.test(password) &&
        hasUpperCase.test(password) &&
        hasSpecialChar.test(password)
    );
};


const validatePhoneNumber = (phoneNumber) => {
    const re = /^03[0-9]{2}-[0-9]{7}$/;
    return re.test(phoneNumber);
};



const validateDateOfBirth = (dateOfBirth) => {
    const date = new Date(dateOfBirth);
    return !isNaN(date.getTime()) && date <= new Date(); // Check if it's a valid date and not in the future
};

// Signup route with manual validation
router.post('/signup', async (req, res) => {
    const { name, email, password, role, phoneNumber, dateOfBirth } = req.body;

    // Manual validation
    const errors = [];

    if (!name) errors.push('Name is required');
    if (!email || !validateEmail(email)) errors.push('Please provide a valid email');
    if (!password || !validatePassword(password))
        errors.push('Password must be at least 6 characters long, contain a number, an uppercase letter, and a special character');
    if (!role || !['manager', 'admin'].includes(role)) errors.push('Role must be either "manager" or "admin"');
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) errors.push('Phone number must be a valid number');
    if (!dateOfBirth || !validateDateOfBirth(dateOfBirth)) errors.push('Date of birth must be a valid date and cannot be in the future');

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password,
            role,
            phoneNumber,
            dateOfBirth,
        });


        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }, 'your_jwt_secret', {
            expiresIn: '1h',
        });

        // Respond with success message and token
        res.status(201).json({
            message: 'User created successfully!',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Login route with manual validation
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Manual validation
    const errors = [];

    if (!email || !validateEmail(email)) errors.push('Please provide a valid email');
    if (!password) errors.push('Password is required');

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Compare password (Ensure it's awaited)
        const isMatch = await user.comparePassword(password); // You need to await this call
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, 'your_jwt_secret', {
            expiresIn: '1h',
        });

        // Send the token in the response
        res.status(200).json({
            message: 'Login successful!',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;

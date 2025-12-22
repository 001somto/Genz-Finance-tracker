// 
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create token
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check for existing email or username
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        if (String(username).trim() === String(password).trim()) {
            return res.status(400).json({ message: 'Username cannot be the same as the password' });
        }

        user = await User.create({ email, username, password });

        res.json({
            token: genToken(user._id),
            user: { _id: user._id, email: user.email, username: user.username }
        });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await user.matchPassword(password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        res.json({
            token: genToken(user._id),
            user: { _id: user._id, email: user.email, username: user.username }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
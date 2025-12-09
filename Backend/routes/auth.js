const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create token
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// SIGNUP
router.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Basic validation: prevent using password as username
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (String(username).trim() === String(password).trim()) {
        return res.status(400).json({ message: 'Username cannot be the same as the password' });
    }

    user = await User.create({ email, username, password });

    res.json({
        token: genToken(user._id),
        user: { _id: user._id, email: user.email, username: user.username }
    });
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
        token: genToken(user._id),
        user: { _id: user._id, email: user.email, username: user.username }
    });
});

module.exports = router;

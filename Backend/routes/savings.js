const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Create a savings goal
router.post('/', auth, async (req, res) => {
    try {
        const goal = new SavingsGoal({
            ...req.body,
            userId: req.user.id
        });
        await goal.save();
        res.status(201).send(goal);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get all savings goals for user
router.get('/', auth, async (req, res) => {
    try {
        const goals = await SavingsGoal.find({ userId: req.user.id });
        res.send(goals);
    } catch (e) {
        res.status(500).send();
    }
});

// Delete a savings goal
router.delete('/:id', auth, async (req, res) => {
    try {
        const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!goal) return res.status(404).send();
        res.send(goal);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;

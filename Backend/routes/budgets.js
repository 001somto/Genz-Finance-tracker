const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Get all budgets for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(budgets);
    } catch (err) {
        console.error('Error fetching budgets:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new budget
router.post('/', auth, async (req, res) => {
    try {
        const { category, amount, period, startDate, endDate } = req.body;

        if (!category || !amount || !period) {
            return res.status(400).json({ message: 'Category, amount, and period are required' });
        }

        const budget = new Budget({
            userId: req.user,
            category,
            amount,
            period,
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : null
        });

        await budget.save();
        res.status(201).json(budget);
    } catch (err) {
        console.error('Error creating budget:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        if (budget.userId.toString() !== req.user) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Budget.findByIdAndDelete(req.params.id);
        res.json({ message: 'Budget deleted' });
    } catch (err) {
        console.error('Error deleting budget:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

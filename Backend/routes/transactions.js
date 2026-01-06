
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Get all transactions for user
router.get('/', auth, async (req, res) => {
    try {
        const tx = await Transaction.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(tx);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create transaction
// Create transaction
router.post('/', auth, async (req, res) => {
    try {
        // Coerce and validate incoming amount
        let { amount, type } = req.body;
        amount = Number(amount);
        if (Number.isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Save transaction (persist numeric amount)
        const tx = await Transaction.create({ ...req.body, amount, user: req.user });
        res.json(tx);
    } catch (err) {
        console.error('Error adding transaction:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update transaction
// Update transaction
router.put('/:id', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const tx = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user },
            req.body,
            { new: true }
        );
        res.json(tx);
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete
// Delete
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user });
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
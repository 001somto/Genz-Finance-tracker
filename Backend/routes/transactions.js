
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

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

        // 1. Calculate user current balance (ensure numeric sums)
        const transactions = await Transaction.find({ user: req.user });

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        const currentBalance = totalIncome - totalExpense;

        // 2. Prevent spending more than available
        if (type === 'expense' && amount > currentBalance) {
            return res.status(400).json({
                message: 'Insufficient balance. Cannot record this expense.'
            });
        }

        // 3. Save transaction if allowed (persist numeric amount)
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
        await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user });
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
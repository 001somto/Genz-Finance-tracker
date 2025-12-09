const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Get all transactions for user
router.get('/', auth, async (req, res) => {
    const tx = await Transaction.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(tx);
});

// Create transaction
router.post('/', auth, async (req, res) => {
    const { amount, type } = req.body;

    // 1. Calculate user current balance
    const transactions = await Transaction.find({ user: req.user });

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = totalIncome - totalExpense;

    // 2. Prevent spending more than available
    if (type === "expense" && amount > currentBalance) {
        return res.status(400).json({
            message: "Insufficient balance. Cannot record this expense."
        });
    }

    // 3. Save transaction if allowed
    const tx = await Transaction.create({ ...req.body, user: req.user });
    res.json(tx);
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
    const tx = await Transaction.findOneAndUpdate(
        { _id: req.params.id, user: req.user },
        req.body,
        { new: true }
    );
    res.json(tx);
});

// Delete
router.delete('/:id', auth, async (req, res) => {
    await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ success: true });
});

module.exports = router;

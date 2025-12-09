const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    amount: Number,
    type: String,
    category: String,
    emoji: String,
    note: String,
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

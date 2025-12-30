const mongoose = require('mongoose');

const SavingsGoalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    period: {
        type: String,
        enum: ['weekly', 'monthly', 'custom'],
        default: 'monthly'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    emoji: {
        type: String,
        default: '💰'
    }
}, { timestamps: true });

module.exports = mongoose.model('SavingsGoal', SavingsGoalSchema);

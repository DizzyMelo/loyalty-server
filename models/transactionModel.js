const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  validated: {
    type: Boolean,
    default: false,
  },
  pending: {
    type: Boolean,
    default: true,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

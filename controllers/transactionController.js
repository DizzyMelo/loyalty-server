const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createTransaction = factory.createOne(Transaction);
exports.getTransactions = factory.getAll(Transaction);
exports.getTransaction = factory.getOne(Transaction);
exports.updateTransaction = factory.updateOne(Transaction);
exports.deleteTransaction = factory.deleteOne(Transaction);

exports.countTransactions = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.params.userId });

  req.body.numTransactions = transactions.length;
  next();
});

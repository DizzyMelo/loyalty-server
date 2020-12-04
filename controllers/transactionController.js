const mongoose = require('mongoose');
const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createTransaction = factory.createOne(Transaction);
exports.getTransactions = factory.getAll(Transaction);
exports.getTransaction = factory.getOne(Transaction);
exports.updateTransaction = factory.updateOne(Transaction);
exports.deleteTransaction = factory.deleteOne(Transaction);

exports.countTransactions = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find({
    user: req.params.userId,
    pending: true,
  });

  req.body.numTransactions = transactions.length;
  next();
});

exports.countTransactionsByUser = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.params.userId),
        pending: true,
      },
    },
    {
      $group: {
        _id: {
          id: '$company',
          name: '$companyName',
        },
        total: { $sum: 1 },
      },
    },
    // { $addFields: { companyName: '$companyName' } },
    // {
    //   $lookup: {
    //     from: 'users',
    //     localField: 'company',
    //     foreignField: '_id',
    //     as: 'user',
    //   },
    // },
    // {
    //   $unwind: '$user',
    // },
  ]);

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    transactions,
  });
});

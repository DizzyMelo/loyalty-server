const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Transaction = require('./transactionModel');

const rewardSchema = mongoose.Schema({
  perk: {
    type: mongoose.Schema.ObjectId,
    ref: 'Perk',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  expires: Date,
  available: {
    type: Boolean,
    default: true,
  },
});

rewardSchema.post(/^save/, function (doc, next) {
  Transaction.find({ pending: true })
    .limit(5)
    .exec(async (err, transactions) => {
      if (err) {
        return next(new AppError('Something went wring!', 400));
      }

      const ids = transactions.map((item) => item._id);

      await Transaction.updateMany({ _id: { $in: ids } }, { pending: false });
    });

  return next();
});

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;

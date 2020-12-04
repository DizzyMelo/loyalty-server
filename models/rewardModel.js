const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Transaction = require('./transactionModel');
const Perk = require('./perkModel');

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

rewardSchema.post(/^save/, async function (doc, next) {
  const perk = await Perk.findById(doc.perk);

  Transaction.find({ pending: true })
    .limit(perk.rounds)
    .exec(async (err, transactions) => {
      if (err) {
        return next(new AppError('Something went wring!', 400));
      }

      const ids = transactions.map((item) => item._id);

      await Transaction.updateMany(
        { _id: { $in: ids }, company: doc.company },
        { pending: false }
      );
    });

  return next();
});

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;

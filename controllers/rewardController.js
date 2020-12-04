const Reward = require('../models/rewardModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createReward = (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    message: 'route will not be implemented',
  });
};
exports.getRewards = factory.getAll(Reward, 'perk');
exports.getReward = factory.getOne(Reward);
exports.updateReward = factory.updateOne(Reward);
exports.deleteReward = factory.deleteOne(Reward);
exports.requestReward = catchAsync(async (req, res, next) => {
  const { numTransactions } = req.body;
  const { rounds } = req.body.perk;

  if (numTransactions < rounds) {
    return next(new Error('No transactions enough!', 400));
  }

  const reward = await Reward.create({
    perk: req.body.perkId,
    user: req.params.userId,
    expires: req.body.expires,
  });

  if (!reward) {
    return next(new Error('Error requesting the reward!', 400));
  }

  res.status(200).json({
    status: 'success',
    reward,
  });
});

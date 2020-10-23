const mongoose = require('mongoose');

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

const Reward = mongoose.model('', rewardSchema);
module.exports = Reward;

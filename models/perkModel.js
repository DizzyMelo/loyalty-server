const mongoose = require('mongoose');

const perkSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'The title is required'],
  },
  description: {
    type: String,
    required: [true, 'The description is required'],
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  rounds: {
    type: Number,
    default: 5,
  },
});

const Perk = mongoose.model('Perk', perkSchema);
module.exports = Perk;

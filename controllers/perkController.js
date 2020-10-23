const Perk = require('../models/perkModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createPerk = factory.createOne(Perk);
exports.getPerks = factory.getAll(Perk);
exports.getPerk = factory.getOne(Perk);
exports.updatePerk = factory.updateOne(Perk);
exports.deletePerk = factory.deleteOne(Perk);
exports.getDetailPerk = catchAsync(async (req, res, next) => {
  const perk = await Perk.findById(req.body.perkId);

  if (!perk) {
    return next(new Error('Perk not found', 404));
  }

  req.body.perk = perk;
  next();
});

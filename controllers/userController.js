const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.createUser = (req, res, next) => {
  res.status(500).json({
    status: 'failed',
    message: 'This route is not implemented',
  });
};
exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

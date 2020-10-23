const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// eslint-disable-next-line no-shadow
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document was found', 404));
    }

    res.status(204).json({
      status: 'success',
      message: 'Document deleted',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document was found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Document updated',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.create(req.body);

    if (popOptions) doc = await doc.populate(popOptions).execPopulate();

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document was found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //if (popOptions) query = query.populate(popOptions);

    const docs = popOptions
      ? await features.query.populate(popOptions)
      : await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

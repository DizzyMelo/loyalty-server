const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredTokenError = () =>
  new AppError('Expired token. Please login again', 401);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.properties.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational Error we trust
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Unknown error
  } else {
    // log the error to the console
    console.error('ERROR', err);
    // send the error
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredTokenError();
    sendErrorProd(error, res);
  }
};

const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const perkRouter = require('./routes/perkRoutes');
const rewardRouter = require('./routes/rewardRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/perks', perkRouter);
app.use('/api/v1/rewards', rewardRouter);

app.use(globalErrorHandler);

module.exports = app;

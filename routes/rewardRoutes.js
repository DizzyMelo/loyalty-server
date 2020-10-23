const express = require('express');
const rewardController = require('../controllers/rewardController');
const perkController = require('../controllers/perkController');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.post(
  '/:userId',
  transactionController.countTransactions,
  perkController.getDetailPerk,
  rewardController.requestReward
);

router
  .route('/')
  .post(rewardController.createReward)
  .get(rewardController.getRewards);

router
  .route('/:id')
  .get(rewardController.getReward)
  .patch(rewardController.updateReward)
  .delete(rewardController.deleteReward);

module.exports = router;

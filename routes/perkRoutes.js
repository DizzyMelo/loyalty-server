const express = require('express');
const perkController = require('../controllers/perkController');

const router = express.Router();

router.route('/').post(perkController.createPerk).get(perkController.getPerks);

router
  .route('/:id')
  .get(perkController.getPerk)
  .patch(perkController.updatePerk)
  .delete(perkController.deletePerk);

module.exports = router;

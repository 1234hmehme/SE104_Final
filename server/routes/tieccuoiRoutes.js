const express = require('express');
const router = express.Router();
const tieccuoiController = require('../controllers/tieccuoiController');

router.post('/', tieccuoiController.create);
router.get('/', tieccuoiController.getAll);
router.put('/:id', tieccuoiController.update);
router.delete('/:id', tieccuoiController.remove);
router.post('/:id/pay', tieccuoiController.pay);
router.post('/:id/cancel', tieccuoiController.cancel);

module.exports = router;
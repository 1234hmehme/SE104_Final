const express = require('express');
const router = express.Router();
const taikhoanController = require('../controllers/taikhoanController');

router.post('/', taikhoanController.register);
router.post('/login', taikhoanController.login);
router.put('/duyet/:id', taikhoanController.approveAccount);
router.get('/', taikhoanController.getall);
router.delete('/:id', taikhoanController.deleteAccount);

module.exports = router;

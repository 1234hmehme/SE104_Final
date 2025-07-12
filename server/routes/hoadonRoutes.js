const express = require('express');
const router = express.Router();
const hoadonController = require('../controllers/hoadonController');

router.get('/', hoadonController.getAll);
router.get('/getDetailById/:id', hoadonController.getDetailById);
router.post('/', hoadonController.create);
router.put('/:id', hoadonController.update);
router.delete('/:id', hoadonController.remove);

module.exports = router;
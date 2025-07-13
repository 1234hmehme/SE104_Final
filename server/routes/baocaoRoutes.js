const express = require('express');
const router = express.Router();
const baocaoController = require('../controllers/baocaoController');

router.post('/', baocaoController.create);
router.put('/:id', baocaoController.update);
router.get('/', baocaoController.getAll);
router.get('/getByThang/:thang/:nam', baocaoController.getByThang);
router.delete('/:id', baocaoController.remove);

module.exports = router;
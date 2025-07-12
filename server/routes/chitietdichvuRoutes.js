const express = require('express');
const router = express.Router();
const chitietdichvuController = require('../controllers/chitietdichvuController');

router.get('/', chitietdichvuController.getAll);
router.get('/getAllByParty/:id', chitietdichvuController.getAllByParty);
router.post('/', chitietdichvuController.create);
router.put('/:id', chitietdichvuController.update);
router.delete('/:id', chitietdichvuController.remove);

module.exports = router;
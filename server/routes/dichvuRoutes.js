const express = require('express');
const router = express.Router();
const dichvuController = require('../controllers/dichvuController');
const upload = require('../cloudinaryConfig');

router.post('/', upload.single('HINHANH'), dichvuController.create);
router.put('/:id', upload.single('HINHANH'), dichvuController.update);
router.get('/', dichvuController.getAll);
router.delete('/:id', dichvuController.remove);

module.exports = router;
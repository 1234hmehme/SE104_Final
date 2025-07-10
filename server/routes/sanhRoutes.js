const express = require('express');
const router = express.Router();
const sanhController = require('../controllers/sanhController');
const upload = require('../cloudinaryConfig');

router.post('/', upload.single('HINHANH'), sanhController.create);
router.put('/:id', upload.single('HINHANH'), sanhController.update);
router.get('/', sanhController.getAll);
router.delete('/:id', sanhController.remove);

module.exports = router;

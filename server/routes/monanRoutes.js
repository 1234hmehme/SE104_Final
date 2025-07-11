const express = require('express');
const router = express.Router();
const monanController = require('../controllers/monanController');
const upload = require('../cloudinaryConfig');

router.post('/', upload.single('HINHANH'), monanController.create);
router.put('/:id', upload.single('HINHANH'), monanController.update);
router.get('/', monanController.getAll);
router.delete('/:id', monanController.remove);

module.exports = router;
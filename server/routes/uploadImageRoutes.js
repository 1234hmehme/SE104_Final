const express = require('express');
const router = express.Router();
const upload = require('../cloudinaryConfig');

router.post('/', upload.single('HINHANH'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'Upload thất bại' });
  }

  res.status(200).json({ imageUrl: req.file.path }); // URL ảnh
});

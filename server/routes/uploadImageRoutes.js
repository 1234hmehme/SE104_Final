const upload = require('../cloudinaryConfig');

router.post('/uploadImage', upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path }); // URL ảnh
});

const sanhServices = require('../services/sanhServices');

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (req.file?.path) data.HINHANH = req.file.path;
    const result = await sanhServices.create(data);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi tạo sảnh:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await sanhServices.getAll();
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách sảnh:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    if (req.file?.path) data.HINHANH = req.file.path;
    const result = await sanhServices.update(req.params.id, data);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi cập nhật sảnh:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await sanhServices.remove(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi xoá sảnh:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
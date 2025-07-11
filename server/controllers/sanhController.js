const sanhServices = require('../services/sanhServices');

exports.create = async (req, res) => {
  try {
    const result = await sanhServices.create(req.body, req.file);
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
    const result = await sanhServices.update(req.params.id, req.body, req.file);
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
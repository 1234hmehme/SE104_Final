const monanServices = require('../services/monanServices');

exports.create = async (req, res) => {
  try {
    const result = await monanServices.create(req.body, req.file);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi tạo món ăn:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await monanServices.getAll();
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách món ăn:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await monanServices.update(req.params.id, req.body, req.file);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi cập nhật món ăn:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await monanServices.remove(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi xoá món ăn:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
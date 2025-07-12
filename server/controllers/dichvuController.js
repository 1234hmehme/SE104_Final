const dichvuServices = require('../services/dichvuServices');

exports.create = async (req, res) => {
  try {
    const result = await dichvuServices.create(req.body, req.file);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi tạo dịch vụ:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await dichvuServices.getAll();
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách dịch vụ:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await dichvuServices.update(req.params.id, req.body, req.file);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi cập nhật dịch vụ:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await dichvuServices.remove(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi xoá dịch vụ:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
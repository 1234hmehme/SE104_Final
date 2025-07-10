const hoadonServices = require('../services/hoadonServices');

exports.getAll = async (req, res) => {
  try {
    const data = await hoadonServices.getAll();
    res.status(200).json(data);
    console.log(data)
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách hoá đơn:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await hoadonServices.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi tạo hoá đơn:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await hoadonServices.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi cập nhật hoá đơn:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await hoadonServices.remove(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi xoá hoá đơn:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
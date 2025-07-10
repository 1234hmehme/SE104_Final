const tieccuoiServices = require('../services/tieccuoiServices');

exports.create = async (req, res) => {
  try {
    const result = await tieccuoiServices.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi tạo tiệc cưới:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await tieccuoiServices.getAll();
    res.status(200).json(result);
    console.log(result)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await tieccuoiServices.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi chỉnh sửa tiệc:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await tieccuoiServices.remove(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi xóa tiệc:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.pay = async (req, res) => {
  try {
    const result = await tieccuoiServices.pay(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi thanh toán:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const result = await tieccuoiServices.cancel(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error('Lỗi hủy tiệc:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
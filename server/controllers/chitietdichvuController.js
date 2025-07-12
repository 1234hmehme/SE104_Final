const chitietdichvuServices = require('../services/chitietdichvuServices');

exports.getAll = async (req, res) => {
  try {
    const data = await chitietdichvuServices.getAll();
    res.status(200).json(data);
    console.log(data)
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách chi tiết dịch vụ:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.getAllByParty = async (req, res) => {
  try {
    const data = await chitietdichvuServices.getAllByParty(req.params.partyId);
    res.status(200).json(data);
    console.log(data)
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách chi tiết dịch vụ theo tiệc cưới:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await chitietdichvuServices.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi tạo chi tiết dịch vụ:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await chitietdichvuServices.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi cập nhật chi tiết dịch vụ:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await chitietdichvuServices.remove(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi xoá chi tiết dịch vụ:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
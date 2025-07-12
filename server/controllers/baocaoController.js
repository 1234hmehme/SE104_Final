const baocaoServices = require('../services/baocaoServices');

exports.create = async (req, res) => {
  try {
    const { THANG, NAM, DOANHTHU } = req.body;
    const result = await baocaoServices.create(THANG, NAM, DOANHTHU);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi tạo báo cáo:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await baocaoServices.getAll();
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách báo cáo:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.getByThang = async (req, res) => {
  try {
    const { thang, nam } = req.params;
    const result = await baocaoServices.getByThang(thang, nam);
    res.status(200).json(result);
    console.log(result)
  } catch (err) {
    console.error('❌ Lỗi lấy báo cáo tháng:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await baocaoServices.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi cập nhật báo cáo:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await baocaoServices.remove(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Lỗi xoá báo cáo:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
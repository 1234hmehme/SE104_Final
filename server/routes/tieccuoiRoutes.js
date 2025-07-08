const express = require('express');
const router = express.Router();
const Tieccuoi = require('./../models/Tieccuoi');
const Hoadon = require('./../models/Hoadon');
const Chitietmonan = require('./../models/Chitietmonan');
const Chitietdichvu = require('../models/Chitietdichvu');
const Baocao = require('../models/Baocao');

// ✅ Hàm cập nhật hoặc xóa báo cáo tháng
async function updateMonthlyReport(date) {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  const invoices = await Hoadon.find({
    NGAYTHANHTOAN: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1),
    },
  });

  const totalRevenue = invoices.reduce((sum, hoadon) => sum + hoadon.TONGTIEN, 0);

  if (totalRevenue === 0) {
    await Baocao.findOneAndDelete({ THANG: month, NAM: year });
    console.log(`🗑️ Xoá báo cáo tháng ${month}/${year} vì doanh thu = 0`);
  } else {
    await Baocao.findOneAndUpdate(
      { THANG: month, NAM: year },
      { THANG: month, NAM: year, DOANHTHU: totalRevenue },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(`✅ Cập nhật báo cáo tháng ${month}/${year}: ${totalRevenue} VND`);
  }
}

// ✅ Tạo tiệc cưới mới
router.post('/', async (req, res) => {
  try {
    const count = await Tieccuoi.countDocuments();
    const newMaTiec = `TC${String(count + 1).padStart(2, '0')}`;

    const data = req.body;
    const { foods = [], services = [] } = data;
    data.MATIEC = newMaTiec;
    if (!data.TRANGTHAI) data.TRANGTHAI = 'Đã đặt cọc';

    const newTieccuoi = new Tieccuoi(data);
    const savedTieccuoi = await newTieccuoi.save();

    // Chi tiết món ăn
    if (foods.length > 0) {
      const foodRecords = foods.map(food => ({
        MATIEC: newMaTiec,
        MAMONAN: food.foodId,
        GIATIEN: food.price,
        GHICHU: food.note || ''
      }));
      await Chitietmonan.insertMany(foodRecords);
    }

    // Chi tiết dịch vụ
    if (services.length > 0) {
      const serviceRecords = services.map(sv => ({
        MATIEC: newMaTiec,
        MADICHVU: sv.serviceId,
        SOLUONG: sv.quantity,
        GIATIEN: sv.price,
        GHICHU: sv.note || ''
      }));
      await Chitietdichvu.insertMany(serviceRecords);
    }

    // Tạo hóa đơn
    const newHoadon = new Hoadon({
      MATIEC: newMaTiec,
      NGAYTHANHTOAN: data.NGAYDAI,
      TONGTIEN: data.TRANGTHAI === 'Đã thanh toán' ? data.TIENCOC * 10 : data.TIENCOC,
    });
    await newHoadon.save();

    // Cập nhật báo cáo tháng
    await updateMonthlyReport(data.NGAYDAI);

    res.status(200).json(savedTieccuoi);
  } catch (err) {
    console.error('❌ Lỗi tạo tiệc cưới:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// ✅ Lấy danh sách tiệc cưới
router.get('/', async (req, res) => {
  try {
    const data = await Tieccuoi.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// ✅ Cập nhật tiệc cưới
router.put('/:id', async (req, res) => {
  try {
    const tieccuoiId = req.params.id;
    const updatedData = req.body;

    const updated = await Tieccuoi.findByIdAndUpdate(tieccuoiId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: 'Tiệc cưới không tồn tại' });

    // Nếu chuyển sang trạng thái thanh toán
    if (updatedData.TRANGTHAI === 'Đã thanh toán') {
      const eventDate = new Date(updatedData.NGAYDAI);
      const today = new Date();
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysLate = Math.max(0, Math.ceil((today - eventDate) / msPerDay));
      const multiplier = daysLate === 0 ? 1 : 1 + (daysLate - 1) / 100;
      const tienPhaiTra = updated.TIENCOC * 10 * multiplier;

      await Hoadon.findOneAndUpdate(
        { MATIEC: updated.MATIEC },
        { $set: { TONGTIEN: tienPhaiTra } }
      );

      await updateMonthlyReport(updatedData.NGAYDAI);
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// ✅ Xoá tiệc cưới + hoá đơn + chi tiết
router.delete('/:id', async (req, res) => {
  try {
    const deletedParty = await Tieccuoi.findByIdAndDelete(req.params.id);
    if (!deletedParty)
      return res.status(404).json({ error: 'Tiệc cưới không tồn tại' });

    await Hoadon.deleteMany({ MATIEC: deletedParty.MATIEC });
    await Chitietmonan.deleteMany({ MATIEC: deletedParty.MATIEC });
    await Chitietdichvu.deleteMany({ MATIEC: deletedParty.MATIEC });

    // Cập nhật lại báo cáo tháng
    await updateMonthlyReport(deletedParty.NGAYDAI);

    res.status(200).json({ message: 'Xoá thành công tiệc cưới và các dữ liệu liên quan' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Tieccuoi = require('./../models/Tieccuoi');
const Hoadon = require('./../models/Hoadon');
const Chitietmonan = require('./../models/Chitietmonan');
const Chitietdichvu = require('../models/Chitietdichvu');
const Baocao = require('../models/Baocao');
const Chitietbaocao = require('../models/Chitietbaocao');

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

// ✅ Hàm cập nhật hoặc tạo chi tiết báo cáo theo ngày
async function updateChiTietBaoCao(date) {
  const d = new Date(date);
  const thang = d.getMonth() + 1;
  const nam = d.getFullYear();
  const maBaoCao = `BC${String(thang).padStart(2, '0')}${nam}`;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const tiecsTrongNgay = await Tieccuoi.find({
    NGAYDAI: { $gte: startOfDay, $lte: endOfDay },
  });

  const soLuong = tiecsTrongNgay.length;
  const doanhThu = tiecsTrongNgay.reduce(
    (sum, t) => sum + (t.TIENCOC || 0) * (t.TRANGTHAI === 'Đã thanh toán' ? 10 : 1),
    0
  );

  const baoCaoThang = await Baocao.findOne({ THANG: thang, NAM: nam });
  const tongThang = baoCaoThang?.DOANHTHU || 1;
  const tyLe = +(doanhThu / tongThang * 100).toFixed(2);

  const existing = await Chitietbaocao.findOne({ Ngay: startOfDay });

  if (soLuong === 0 || doanhThu === 0) {
    await Chitietbaocao.deleteOne({ Ngay: startOfDay });
    console.log(`🗑️ Đã xoá Chitietbaocao ngày ${startOfDay.toISOString().slice(0, 10)}`);
  } else if (existing) {
    await Chitietbaocao.updateOne(
      { Ngay: startOfDay },
      {
        $set: {
          MaBaoCao: maBaoCao,
          SoLuongTieccuoi: soLuong,
          DoanhThu: doanhThu,
          TyLe: tyLe,
        },
      }
    );
    console.log(`✅ Cập nhật Chitietbaocao ngày ${startOfDay.toISOString().slice(0, 10)}`);
  } else {
    await Chitietbaocao.create({
      MaBaoCao: maBaoCao,
      Ngay: startOfDay,
      SoLuongTieccuoi: soLuong,
      DoanhThu: doanhThu,
      TyLe: tyLe,
    });
    console.log(`✅ Tạo mới Chitietbaocao ngày ${startOfDay.toISOString().slice(0, 10)}`);
  }
}

// ✅ Hàm cập nhật tất cả chi tiết báo cáo trong tháng
async function updateAllChiTietBaoCaoInMonth(date) {
  const d = new Date(date);
  const month = d.getMonth();
  const year = d.getFullYear();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  for (
    let day = new Date(startOfMonth);
    day <= endOfMonth;
    day.setDate(day.getDate() + 1)
  ) {
    await updateChiTietBaoCao(new Date(day));
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

    if (foods.length > 0) {
      const foodRecords = foods.map(food => ({
        MATIEC: newMaTiec,
        MAMONAN: food.foodId,
        GIATIEN: food.price,
        GHICHU: food.note || '',
      }));
      await Chitietmonan.insertMany(foodRecords);
    }

    if (services.length > 0) {
      const serviceRecords = services.map(sv => ({
        MATIEC: newMaTiec,
        MADICHVU: sv.serviceId,
        SOLUONG: sv.quantity,
        GIATIEN: sv.price,
        GHICHU: sv.note || '',
      }));
      await Chitietdichvu.insertMany(serviceRecords);
    }

    const newHoadon = new Hoadon({
      MATIEC: newMaTiec,
      NGAYTHANHTOAN: data.NGAYDAI,
      TONGTIEN: data.TRANGTHAI === 'Đã thanh toán' ? data.TIENCOC * 10 : data.TIENCOC,
    });
    await newHoadon.save();

    await updateMonthlyReport(data.NGAYDAI);
    await updateAllChiTietBaoCaoInMonth(data.NGAYDAI);

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

    if (!updated)
      return res.status(404).json({ error: 'Tiệc cưới không tồn tại' });

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
      await updateAllChiTietBaoCaoInMonth(updatedData.NGAYDAI); // ✅ cập nhật lại tất cả ngày trong tháng
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

    await updateMonthlyReport(deletedParty.NGAYDAI);
    await updateAllChiTietBaoCaoInMonth(deletedParty.NGAYDAI); // ✅ cập nhật lại tất cả ngày trong tháng

    res.status(200).json({ message: 'Xoá thành công tiệc cưới và các dữ liệu liên quan' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;

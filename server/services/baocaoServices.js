const Baocao = require('../models/Baocao');
const Chitietbaocao = require('../models/Chitietbaocao');
const Tieccuoi = require('../models/Tieccuoi');
const Hoadon = require('../models/Hoadon');

exports.create = async (THANG, NAM, DOANHTHU) => {
  return await Baocao.findOneAndUpdate(
    { THANG, NAM },                  // tìm theo tháng và năm
    { $set: { DOANHTHU } },          // cập nhật doanh thu
    { upsert: true, new: true }      // nếu chưa có thì tạo mới
  );
};

exports.getAll = async () => {
  return await Baocao.find();
};

exports.getByThang = async (THANG, NAM) => {
  const baocao = await Baocao.findOne({ THANG, NAM });

  const maBaoCao = `BC${String(THANG).padStart(2, '0')}${NAM}`;
  const ctbcTrongThang = await Chitietbaocao.find({ MaBaoCao: maBaoCao }).sort({ Ngay: 1 });

  return {
    DOANHTHU: baocao?.DOANHTHU || 0,
    ctbcTrongThang: ctbcTrongThang || []
  };
}

exports.update = async (id, updateData) => {
  const updated = await Baocao.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
  if (!updated) throw new Error('Báo cáo không tồn tại');
  return updated;
};

exports.remove = async (id) => {
  const deleted = await Baocao.findByIdAndDelete(id);
  if (!deleted) throw new Error('Báo cáo không tồn tại');

  return {
    message: 'Xóa báo cáo thành công',
  };
};

exports.updateMonthlyReport = async (date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  const invoices = await Hoadon.find({
    NGAYTHANHTOAN: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1),
    },
  });

  const totalRevenue = invoices.reduce((sum, hoadon) => sum + hoadon.SOTIENHOADON, 0);

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

exports.updateChiTietBaoCao = async (date) => {
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

  const maTiecList = tiecsTrongNgay.map(t => t.MATIEC);

  const hoadons = await Hoadon.find({ MATIEC: { $in: maTiecList } });
  const doanhThu = hoadons.reduce((sum, h) => sum + h.SOTIENHOADON, 0);

  const existing = await Chitietbaocao.findOne({ Ngay: startOfDay });

  if (soLuong === 0 || doanhThu === 0) {
    await Chitietbaocao.deleteOne({ Ngay: startOfDay });
    console.log(`🗑️ Đã xoá Chitietbaocao ngày ${startOfDay.toISOString().slice(0, 10)}`);
  } else if (existing) {
    await Chitietbaocao.updateOne(
      { Ngay: startOfDay },
      {
        $set: {
          SoLuongTieccuoi: soLuong,
          DoanhThu: doanhThu,
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
    });
    console.log(`✅ Tạo mới Chitietbaocao ngày ${startOfDay.toISOString().slice(0, 10)}`);
  }
}

exports.updateAllChiTietBaoCaoInMonth = async (date) => {
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
    await baocaoServices.updateChiTietBaoCao(new Date(day));
  }
}
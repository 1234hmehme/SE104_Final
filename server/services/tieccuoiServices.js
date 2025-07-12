const Tieccuoi = require('../models/Tieccuoi');
const Hoadon = require('../models/Hoadon');
const Chitietmonan = require('../models/Chitietmonan');
const Chitietdichvu = require('../models/Chitietdichvu');
const baocaoServices = require('../services/baocaoServices');
const { v4: uuidv4 } = require('uuid');

exports.create = async (data) => {
  const newMaTiec = uuidv4();
  const { foods = [], services = [] } = data;

  data.MATIEC = newMaTiec;
  if (!data.TRANGTHAI) data.TRANGTHAI = 'Đã đặt cọc';

  const newTiec = await new Tieccuoi(data).save();

  if (foods.length > 0) {
    const records = foods.map(f => ({ MATIEC: newMaTiec, MAMONAN: f.foodId, GIATIEN: f.price, GHICHU: f.note || '' }));
    await Chitietmonan.insertMany(records);
  }

  if (services.length > 0) {
    const records = services.map(s => ({ MATIEC: newMaTiec, MADICHVU: s.serviceId, SOLUONG: s.quantity, GIATIEN: s.price, GHICHU: s.note || '' }));
    await Chitietdichvu.insertMany(records);
  }
  const tienBan = foods.reduce((sum, f) => sum + f.price, 0);
  const tienDichVu = services.reduce((sum, s) => sum + s.price * s.quantity, 0);

  await new Hoadon({
    MATIEC: newMaTiec,
    SOTIENHOADON: data.TIENCOC,
    TIENPHAT: 0,
    TIENBAN: tienBan * (data.SOLUONGBAN + data.SOBANDT),
    TIENDICHVU: tienDichVu,
    LOAIHOADON: 'Đặt cọc'
  }).save();

  await baocaoServices.updateMonthlyReport(data.NGAYDAI);
  await baocaoServices.updateChiTietBaoCao(data.NGAYDAI);

  return newTiec;
};

exports.getAll = async () => {
  const tiecs = await Tieccuoi.find().populate('MASANH', 'TENSANH LOAISANH').lean();
  const result = tiecs.map(tiec => ({
    ...tiec,
    TENSANH: tiec.MASANH?.TENSANH,
    LOAISANH: tiec.MASANH?.LOAISANH,
    MASANH: tiec.MASANH?._id  // hoặc để nguyên
  }));
  return result;
};

exports.update = async (id, data) => {
  const updated = await Tieccuoi.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!updated) throw new Error('Tiệc cưới không tồn tại');

  return updated;
};

exports.remove = async (id) => {
  const deleted = await Tieccuoi.findByIdAndDelete(id);
  if (!deleted) throw new Error('Tiệc cưới không tồn tại');

  await Hoadon.deleteMany({ MATIEC: deleted.MATIEC });
  await Chitietmonan.deleteMany({ MATIEC: deleted.MATIEC });
  await Chitietdichvu.deleteMany({ MATIEC: deleted.MATIEC });

  await baocaoServices.updateMonthlyReport(deleted.NGAYDAI);
  await baocaoServices.updateChiTietBaoCao(deleted.NGAYDAI);

  return { message: 'Đã xoá tiệc cưới và dữ liệu liên quan' };
};

exports.pay = async (id) => {
  const tiec = await Tieccuoi.findById(id);
  if (!tiec) throw new Error('Tiệc cưới không tồn tại');

  const daysLate = Math.max(0, Math.ceil((new Date() - new Date(tiec.NGAYDAI)) / (1000 * 60 * 60 * 24)));
  const penalty = daysLate > 0 ? (daysLate - 1) * 0.01 * tiec.TIENCOC * 10 : 0;
  const total = tiec.TIENCOC * 9 + penalty;

  tiec.TRANGTHAI = 'Đã thanh toán';

  await tiec.save();
  
  const hoaDonDatCoc = await Hoadon.findOne({ MATIEC: tiec.MATIEC });

  const newHoadon = new Hoadon({
    MATIEC: tiec.MATIEC,
    SOTIENHOADON: total,
    TIENPHAT: penalty,
    TIENBAN: hoaDonDatCoc.TIENBAN,
    TIENDICHVU: hoaDonDatCoc.TIENDICHVU,
    LOAIHOADON: 'Thanh toán'
  });
  await newHoadon.save();

  await baocaoServices.updateMonthlyReport(tiec.NGAYDAI);
  await baocaoServices.updateChiTietBaoCao(tiec.NGAYDAI);

  return { message: 'Đã thanh toán thành công', TONGTIEN: total };
};

exports.cancel = async (id) => {
  const tiec = await Tieccuoi.findById(id);
  if (!tiec) throw new Error('Tiệc cưới không tồn tại');

  tiec.TRANGTHAI = 'Đã huỷ';
  await tiec.save();

  return { message: 'Đã hủy tiệc cưới thành công' };
};

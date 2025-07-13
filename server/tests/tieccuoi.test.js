const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');

const Tieccuoi = require('../models/Tieccuoi');
const Hoadon = require('../models/Hoadon');
const Sanh = require('../models/Sanh');
const Monan = require('../models/Monan');
const Dichvu = require('../models/Dichvu');
const ChiTietMonAn = require('../models/Chitietmonan');
const ChiTietDichVu = require('../models/Chitietdichvu');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all([
    Tieccuoi.deleteMany(),
    Hoadon.deleteMany(),
    Sanh.deleteMany(),
    Monan.deleteMany(),
    Dichvu.deleteMany(),
  ]);
});

describe('💒 QUY TRÌNH ĐẶT TIỆC CƯỚI', () => {
  const setupTiec = async (ngayDai) => {
    const resSanh = await request(app).post('/api/sanh').send({
      TENSANH: 'Sảnh Kim Cương',
      LOAISANH: 'VIP',
      DONGIABANTT: 1000000,
      SOLUONGBANTD: 40,
      GHICHU: 'Sảnh cao cấp'
    });
    const sanhId = resSanh.body._id;

    const resMon1 = await request(app).post('/api/monan').send({
      TENMONAN: 'Lẩu hải sản',
      LOAI: 'Món Chính',
      DONGIA: 150000
    });
    const resMon2 = await request(app).post('/api/monan').send({
      TENMONAN: 'Gỏi ngó sen',
      LOAI: 'Món Khai Vị',
      DONGIA: 200000
    });

    const resDV = await request(app).post('/api/dichvu').send({
      TENDICHVU: 'Ban nhạc sống',
      DONGIA: 1000000,
      GHICHU: 'Ban nhạc biểu diễn',
      DANHMUC: 'Giải trí'
    });

    const slBan = 10, slBanDT = 2;
    const tongBan = slBan + slBanDT;
    const tienMon = 150000 + 200000;
    const tienBan = tienMon * tongBan;
    const tienDV = 1000000;
    const tiencoc = (tienBan + tienDV) / 10;

    const resTiec = await request(app).post('/api/tieccuoi').send({
      NGAYDAI: ngayDai,
      CA: 'Trưa',
      SOLUONGBAN: slBan,
      SOBANDT: slBanDT,
      MASANH: sanhId,
      TENCR: 'Nguyễn Văn A',
      TENCD: 'Trần Thị B',
      SDT: '0987654321',
      TIENCOC: tiencoc,
      foods: [
        { foodId: resMon1.body._id, price: 150000 },
        { foodId: resMon2.body._id, price: 200000 }
      ],
      services: [
        { serviceId: resDV.body._id, price: 1000000, quantity: 1 }
      ]
    });

 
    // vì POST trả về hóa đơn, lấy MATIEC từ đó
    const matiec = resTiec.body.MATIEC;
    // lookup Tieccuoi bằng MATIEC
    const tiec = await Tieccuoi.findOne({ MATIEC: matiec }).lean();
    return { tiec, tiencoc, tienBan, tienDV };
  };

  // 1️⃣ Đặt tiệc và tạo hóa đơn đặt cọc
  it('1. Đặt tiệc thành công và tạo hóa đơn đặt cọc', async () => {
    const { tiec, tiencoc } = await setupTiec('2025-12-25');
    const hoadons = await Hoadon.find({ MATIEC: tiec.MATIEC });
    expect(hoadons.length).toBe(1);
    expect(hoadons[0].LOAIHOADON).toBe('Đặt cọc');
    expect(hoadons[0].SOTIENHOADON).toBe(tiencoc);
  });

  // 2️⃣ Thanh toán đúng hạn
  it('2. Thanh toán đúng hạn không bị phạt', async () => {
    const { tiec, tiencoc, tienBan, tienDV } = await setupTiec('2099-01-01');
    const resPay = await request(app).post(`/api/tieccuoi/${tiec._id}/pay`).send();
    expect(resPay.statusCode).toBe(200);
    expect(resPay.body.SOTIENHOADON).toBe(tiencoc * 9);

    const allBills = await Hoadon.find({ MATIEC: tiec.MATIEC });
    expect(allBills.length).toBe(2);

    const payBill = allBills.find(b => b.LOAIHOADON === 'Thanh toán');
    expect(payBill.TIENPHAT).toBe(0);
    expect(payBill.SOTIENHOADON).toBe(tiencoc * 9);
    expect(payBill.TIENBAN).toBe(tienBan);
    expect(payBill.TIENDICHVU).toBe(tienDV);
  });

  // 3️⃣ Thanh toán trễ
  it('3. Thanh toán trễ sẽ tính tiền phạt', async () => {
    const ngayDai = new Date();
    ngayDai.setDate(ngayDai.getDate() - 3);
    const { tiec, tiencoc } = await setupTiec(ngayDai.toISOString().split('T')[0]);

    const resPay = await request(app).post(`/api/tieccuoi/${tiec._id}/pay`).send();
    expect(resPay.statusCode).toBe(200);

    const daysLate = Math.ceil((new Date() - new Date(ngayDai)) / (1000 * 60 * 60 * 24));
    const penalty = (daysLate - 1) * 0.01 * tiencoc * 10;
    const expectedTotal = tiencoc * 9 + penalty;

    const payBill = await Hoadon.findOne({ MATIEC: tiec.MATIEC, LOAIHOADON: 'Thanh toán' });

    expect(resPay.body.SOTIENHOADON).toBe(expectedTotal);
    expect(payBill.TIENPHAT).toBe(penalty);
    expect(payBill.SOTIENHOADON).toBe(expectedTotal);
  });

  // 4️⃣ Lỗi khi không chọn món ăn
  it('4. Không chọn món ăn sẽ báo lỗi', async () => {
    const resSanh = await request(app).post('/api/sanh').send({
      TENSANH: 'Sảnh Rồng Vàng',
      LOAISANH: 'Thường',
      DONGIABANTT: 800000,
      SOLUONGBANTD: 30,
    });

    const res = await request(app).post('/api/tieccuoi').send({
      NGAYDAI: '2025-12-12',
      CA: 'Tối',
      SOLUONGBAN: 5,
      SOBANDT: 0,
      MASANH: resSanh.body._id,
      TENCR: 'Anh A',
      TENCD: 'Chị B',
      SDT: '0123456789',
      foods: [],    // không chọn món ăn
      services: []
    });

    expect([400, 422, 500]).toContain(res.statusCode);
    expect(res.body.message || res.body.error || '').toMatch("Internal Server Error" );
  });

  // 5️⃣ Lỗi khi tổng tiền món < đơn giá bàn
  it('5. Tổng tiền món < đơn giá bàn → lỗi', async () => {
    const resSanh = await request(app).post('/api/sanh').send({
      TENSANH: 'Sảnh Trung',
      LOAISANH: 'VIP',
      DONGIABANTT: 200000,
      SOLUONGBANTD: 30,
    });

    const resMon = await request(app).post('/api/monan').send({
      TENMONAN: 'Bánh hỏi',
      LOAI: 'Món chính',
      DONGIA: 100000
    });

    const res = await request(app).post('/api/tieccuoi').send({
      NGAYDAI: '2025-11-11',
      CA: 'Trưa',
      SOLUONGBAN: 5,
      SOBANDT: 0,
      MASANH: resSanh.body._id,
      TENCR: 'A',
      TENCD: 'B',
      SDT: '0123456789',
      foods: [{ foodId: resMon.body._id, price: 100000 }],
      services: []
    });

    expect([400, 422, 500]).toContain(res.statusCode);
    expect(res.body.message || res.body.error || '').toMatch("Internal Server Error");
  });

 

  // 7️⃣ Xóa tiệc sẽ xóa hóa đơn và chi tiết liên quan
  it('7. Xóa tiệc sẽ xóa hóa đơn và chi tiết liên quan', async () => {
    const { tiec } = await setupTiec('2025-12-12');

    // Đảm bảo có dữ liệu trước khi xóa
    const hoadonsBefore = await Hoadon.find({ MATIEC: tiec.MATIEC });
    const ctMAsBefore = await ChiTietMonAn.find({ MATIEC: tiec.MATIEC });
    const ctDVsBefore = await ChiTietDichVu.find({ MATIEC: tiec.MATIEC });

    expect(hoadonsBefore.length).toBeGreaterThan(0);
    expect(ctMAsBefore.length).toBeGreaterThan(0);
    expect(ctDVsBefore.length).toBeGreaterThan(0);

    // Xoá tiệc cưới
    const res = await request(app).delete(`/api/tieccuoi/${tiec._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch("Đã xoá tiệc cưới và dữ liệu liên quan");

    // Kiểm tra đã xóa tiệc
    const tiecDeleted = await Tieccuoi.findById(tiec._id);
    expect(tiecDeleted).toBeNull();

    // Kiểm tra đã xóa hóa đơn
    const hoadonsAfter = await Hoadon.find({ MATIEC: tiec.MATIEC });
    expect(hoadonsAfter.length).toBe(0);

    // Kiểm tra đã xóa chi tiết món ăn
    const ctMAsAfter = await ChiTietMonAn.find({ MATIEC: tiec.MATIEC });
    expect(ctMAsAfter.length).toBe(0);

    // Kiểm tra đã xóa chi tiết dịch vụ
    const ctDVsAfter = await ChiTietDichVu.find({ MATIEC: tiec.MATIEC });
    expect(ctDVsAfter.length).toBe(0);
  });


});

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');

const Tieccuoi = require('../models/Tieccuoi');
const Hoadon = require('../models/Hoadon');
const Sanh = require('../models/Sanh');
const Monan = require('../models/Monan');
const Dichvu = require('../models/Dichvu');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
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

describe('Quy trình đặt tiệc cưới đầy đủ', () => {
  const setupTiec = async (ngayDai) => {
    // 1. Tạo sảnh
    const resSanh = await request(app).post('/api/sanh').send({
      TENSANH: "Sảnh Kim Cương",
      LOAISANH: "VIP",
      DONGIABANTT: 1000000,
      SOLUONGBANTD: 40,
      GHICHU: "Sảnh cao cấp"
    });
    const sanhId = resSanh.body._id;

    // 2. Tạo món ăn
    const resMon1 = await request(app).post('/api/monan').send({
      TENMONAN: "Lẩu hải sản",
      LOAI: "Món Chính",
      DONGIA: 150000
    });
    const resMon2 = await request(app).post('/api/monan').send({
      TENMONAN: "Gỏi ngó sen",
      LOAI: "Món Khai Vị",
      DONGIA: 200000
    });

    // 3. Tạo dịch vụ
    const resDV = await request(app).post('/api/dichvu').send({
      TENDICHVU: "Ban nhạc sống",
      DONGIA: 1000000,
      GHICHU: "Ban nhạc biểu diễn",
      DANHMUC: "Giải trí"
    });

    const slBan = 10, slBanDT = 2;
    const tongBan = slBan + slBanDT;
    const tienMon = 150000 + 200000;
    const tienDV = 1000000;
    const tiencoc = (tienMon * tongBan + tienDV) / 10;

    const resTiec = await request(app).post('/api/tieccuoi').send({
      NGAYDAI: ngayDai,
      CA: "Trưa",
      SOLUONGBAN: slBan,
      SOBANDT: slBanDT,
      MASANH: sanhId,
      TENCR: "Nguyễn Văn A",
      TENCD: "Trần Thị B",
      SDT: "0987654321",
      TIENCOC: tiencoc,
      foods: [
        { foodId: resMon1.body._id, price: 150000 },
        { foodId: resMon2.body._id, price: 200000 }
      ],
      services: [
        { serviceId: resDV.body._id, price: 1000000, quantity: 1 }
      ]
    });

    return { tiec: resTiec.body, tiencoc, tienMon, tienDV };
  };

  it('1. Đặt tiệc và tạo hóa đơn đặt cọc', async () => {
    const { tiec, tiencoc } = await setupTiec("2025-12-25");
    const hoadons = await Hoadon.find({ MATIEC: tiec.MATIEC });
    expect(hoadons.length).toBe(1);
    expect(hoadons[0].LOAIHOADON).toBe("Đặt cọc");
    expect(hoadons[0].SOTIENHOADON).toBe(tiencoc);
  });

  it('2. Thanh toán đúng hạn không có phạt', async () => {
    const { tiec, tiencoc, tienMon, tienDV } = await setupTiec("2099-01-01");
    const resPay = await request(app).post(`/api/tieccuoi/${tiec._id}/pay`).send();
    expect(resPay.statusCode).toBe(200);
    expect(resPay.body.TONGTIEN).toBe(tiencoc * 10); // Không có phạt

    const allBills = await Hoadon.find({ MATIEC: tiec.MATIEC });
    expect(allBills.length).toBe(2);

    const payBill = allBills.find(b => b.LOAIHOADON === 'Thanh toán');
    expect(payBill.TIENPHAT).toBe(0);
    expect(payBill.SOTIENHOADON).toBe(tiencoc * 10);
    expect(payBill.TIENBAN).toBe(tienMon);
    expect(payBill.TIENDICHVU).toBe(tienDV);
  });

  it('3. Thanh toán trễ sẽ có tiền phạt', async () => {
    const ngayDai = new Date();
    ngayDai.setDate(ngayDai.getDate() - 3); // NGAYDAI = 3 ngày trước

    const { tiec, tiencoc } = await setupTiec(ngayDai.toISOString().split('T')[0]);

    const resPay = await request(app).post(`/api/tieccuoi/${tiec._id}/pay`).send();
    expect(resPay.statusCode).toBe(200);

    const daysLate = Math.max(0, Math.ceil((new Date() - new Date(ngayDai)) / (1000 * 60 * 60 * 24)));
    const penalty = daysLate > 0 ? (daysLate - 1) * 0.01 * tiencoc * 10 : 0;
    const expectedTotal = tiencoc * 10 + penalty;

    const payBill = await Hoadon.findOne({ MATIEC: tiec.MATIEC, LOAIHOADON: 'Thanh toán' });

    expect(resPay.body.TONGTIEN).toBe(expectedTotal);
    expect(payBill.TIENPHAT).toBe(penalty);
    expect(payBill.SOTIENHOADON).toBe(expectedTotal);
  });

});

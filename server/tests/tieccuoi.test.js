// tests/party.integration.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dayjs = require('dayjs');
const app = require('../apptest');

const Tieccuoi       = require('../models/Tieccuoi');
const Hoadon         = require('../models/Hoadon');
const Chitietmonan   = require('../models/Chitietmonan');
const Chitietdichvu  = require('../models/Chitietdichvu');

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
  // xóa toàn bộ collections
  await Promise.all([
    Tieccuoi.deleteMany(),
    Hoadon.deleteMany(),
    Chitietmonan.deleteMany(),
    Chitietdichvu.deleteMany(),
  ]);
});

describe('Full workflow: tiệc cưới', () => {


  it('1. Tạo tiệc + chọn món + chọn dịch vụ + tạo hóa đơn', async () => {
    // Tạo tiệc
    const resTiec = await request(app).post('/api/tieccuoi').send({
      MATIEC: "TCTEST0012",
      NGAYDAI: "2025-12-25",
      TIENCOC: 5000000,
      CA: "Trưa",
      SOLUONGBAN: 50,
      MASANH: "6860397e953b6c77104d57db",
      SOBANDT: 0,
      TENCR: "Nguyễn Văn Nam",
      TENCD: "Trần Thị Lan",
      SDT: "0912345678",
      TRANGTHAI: "Đã đặt cọc"
    });
    expect(resTiec.statusCode).toBe(200);
    matiec = resTiec.body._id;

    // 2. Chọn món ăn
    const resMon = await request(app).post('/api/chitietmonan').send({
      MATIEC: matiec,
      MAMONAN: "M001",
      GIATIEN: 120000
    });
    expect(resMon.statusCode).toBe(200);

    // 3. Chọn dịch vụ
    const resDV = await request(app).post('/api/chitietdichvu').send({
      MATIEC: matiec,
      MADICHVU: "DV001",
      SOLUONG: 2,
      GIATIEN: 1500000
    });
    expect(resDV.statusCode).toBe(200);

    // 4. Tạo hóa đơn
    const resHD = await request(app).post('/api/hoadon').send({
      MATIEC: matiec,
      TIENBAN: 1000000,
      TIENDICHVU: 3000000,
      TIENPHAT: 500000,
      SOTIENHOADON: 1000000 + 3000000 + 500000,
      LOAIHOADON: "Thanh toán"
    });
    expect(resHD.statusCode).toBe(200);
    expect(resHD.body.SOTIENHOADON).toBe(4500000);
    expect(resHD.body.TIENBAN).toBe(1000000);
    expect(resHD.body.TIENDICHVU).toBe(3000000);
    expect(resHD.body.TIENPHAT).toBe(500000);
  });
});
     it('2. PUT /api/tieccuoi/:id chuyển sang Đã thanh toán → cập nhật phạt theo số ngày trễ', async () => {
    // 1) Tạo tiệc ngày hôm qua
    const yesterday = dayjs().subtract(1, 'day').toISOString();
    const created = await Tieccuoi.create({
      MATIEC:    'TCTEST002',
      NGAYDAI:   yesterday,
      TIENCOC:   1000,
      CA:        'Tối',
      SOLUONGBAN:10,
      MASANH:    'hallX',
      SOBANDT:   0,
      TENCR:     'A',
      TENCD:     'B',
      SDT:       '0999999999',
      TRANGTHAI: 'Đã đặt cọc',
    });

    // 2) Tạo hoá đơn khởi tạo
    await Hoadon.create({
      MATIEC:       created.MATIEC,
      NGAYTHANHTOAN: yesterday,
      SOTIENHOADON: created.TIENCOC * 10,  // gốc = cọc × 10
      TIENPHAT:     0,
      TIENBAN:      0,
      TIENDICHVU:   0,
      LOAIHOADON:   'Thanh toán'
    });

    // 3) Gọi PUT để chuyển trạng thái thành "Đã thanh toán"
    const resPut = await request(app)
      .put(`/api/tieccuoi/${created._id}`)
      .send({
        TRANGTHAI: 'Đã thanh toán',
        NGAYDAI:   yesterday
      });
    expect(resPut.status).toBe(200);

    // 4) Lấy lại hoá đơn và kiểm tra
    const inv = await Hoadon.findOne({ MATIEC: created.MATIEC });
    expect(inv).not.toBeNull();

    const base    = created.TIENCOC * 10;
    const daysLate = 1; // đã tạo NGAYDAI = yesterday → trễ 1 ngày
    const penalty = base * (daysLate / 100);
    const total   = base + penalty;

    expect(inv.TIENPHAT).toBeCloseTo(penalty);
    expect(inv.SOTIENHOADON).toBeCloseTo(total);
  });
  it('3. DELETE /api/tieccuoi/:id → xóa tiệc và hóa đơn liên quan', async () => {
    // tạo tiệc + hóa đơn
// in test 2
const created = await Tieccuoi.create({
  MATIEC: 'TCYY',
  NGAYDAI: dayjs().toISOString(),
  TIENCOC: 2000,
  CA: 'Trưa',
  SOLUONGBAN: 5,
  MASANH: 'hallY',
  SOBANDT: 0,
  TENCR: 'X',
  TENCD: 'Y',
  SDT: '0888888888',
  TRANGTHAI: 'Đã đặt cọc'
});

    await Hoadon.create({ MATIEC: created.MATIEC, NGAYTHANHTOAN: created.NGAYDAI, TONGTIEN: 2000 });

    // xóa tiệc
    const resDel = await request(app)
      .delete(`/api/tieccuoi/${created._id}`);
    expect(resDel.status).toBe(200);
    expect(resDel.body.message).toMatch(/Xoá/i);

    // confirm tiệc + hóa đơn đã biến mất
    const p = await Tieccuoi.findById(created._id);
    const hd = await Hoadon.findOne({ MATIEC: created.MATIEC });
    expect(p).toBeNull();
    expect(hd).toBeNull();
  });

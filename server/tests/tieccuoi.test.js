const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');

const Hoadon = require('../models/Hoadon');
const Chitietmonan = require('../models/Chitietmonan');
const Chitietdichvu = require('../models/Chitietdichvu');

let mongoServer;
let matiec; // để dùng xuyên suốt các bước

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
  await mongoose.connection.db.dropDatabase();
});

describe('Quy trình tạo tiệc cưới và hóa đơn', () => {
  it('Tạo tiệc cưới, chọn món, dịch vụ và tạo hóa đơn đúng tiền', async () => {
    // 1. Tạo tiệc cưới
    const resTiec = await request(app).post('/api/tieccuoi').send({
      MATIEC: "78d91ad5-c688-48c6-96fd-882971e4424d",
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

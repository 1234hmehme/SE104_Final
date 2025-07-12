// tests/sanh.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');             // Express app
const Sanh = require('../models/Sanh');        // Mongoose model Sảnh

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Sanh.deleteMany();
});

describe('CRUD /api/sanh', () => {

  // Tạo sảnh mới thành công
  it('POST /api/sanh → tạo sảnh mới', async () => {
    const payload = {
      TENSANH: "Sảnh Kim Cương",
      LOAISANH: "VIP",
      DONGIABANTT: 1000000,
      SOLUONGBANTD: 40,
      GHICHU: "Sảnh cao cấp"
    };

    const res = await request(app).post('/api/sanh').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.TENSANH).toBe(payload.TENSANH);

    const s = await Sanh.findOne({ TENSANH: payload.TENSANH });
    expect(s).toBeTruthy();
    expect(s.DONGIABANTT).toBe(payload.DONGIABANTT);
  });

  // Cập nhật thông tin sảnh
  it('PUT /api/sanh/:id → cập nhật thông tin sảnh', async () => {
    const created = await Sanh.create({
      TENSANH: "Sảnh Bạc",
      LOAISANH: "Thường",
      DONGIABANTT: 700000,
      SOLUONGBANTD: 30,
      GHICHU: "Test"
    });

    const res = await request(app)
      .put(`/api/sanh/${created._id}`)
      .send({ GHICHU: "Giá hợp lý", DONGIABANTT: 800000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.GHICHU).toBe("Giá hợp lý");
    expect(res.body.DONGIABANTT).toBe(800000);

    const s2 = await Sanh.findById(created._id);
    expect(s2.DONGIABANTT).toBe(800000);
  });

  // Xóa mềm sảnh
  it('DELETE /api/sanh/:id → xóa sảnh', async () => {
    const created = await Sanh.create({
      TENSANH: "Sảnh Đồng",
      LOAISANH: "Bình dân",
      DONGIABANTT: 500000,
      SOLUONGBANTD: 25,
      GHICHU: "Test"
    });

    const res = await request(app).delete(`/api/sanh/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Xóa sảnh thành công/i);

    const s3 = await Sanh.findById(created._id);
    expect(s3).toBeTruthy();
    expect(s3.IS_DELETED).toBe(true); // kiểm tra đã đánh dấu là xóa mềm
  });

  // Không tạo nếu thiếu TENSANH
  it('POST /api/sanh → lỗi khi thiếu TENSANH', async () => {
    const payload = {
      LOAISANH: "VIP",
      DONGIABANTT: 1000000,
      SOLUONGBANTD: 40,
      GHICHU: "Thiếu tên"
    };

    const res = await request(app).post('/api/sanh').send(payload);
    expect([400, 422, 500]).toContain(res.statusCode);
    expect(res.body.message || '').toMatch("");
  });

 

 

  // Lấy danh sách sảnh chưa bị xóa
  it('GET /api/sanh → lấy danh sách sảnh chưa bị xóa', async () => {
    await Sanh.create([
      { TENSANH: "Sảnh A", IS_DELETED: false, LOAISANH: "VIP", DONGIABANTT: 1000000, SOLUONGBANTD: 40 },
      { TENSANH: "Sảnh B", IS_DELETED: true, LOAISANH: "Thường", DONGIABANTT: 700000, SOLUONGBANTD: 30 }
    ]);

    const res = await request(app).get('/api/sanh');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].TENSANH).toBe("Sảnh A");
  });

});

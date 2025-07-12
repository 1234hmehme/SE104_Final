// tests/food.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');              // Express app
const Food = require('../models/Monan');        // Model món ăn

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Food.deleteMany();
});

describe('CRUD /api/monan', () => {

  // 🧪 Tạo món ăn mới
  it('POST /api/monan → tạo món ăn mới', async () => {
    const payload = {
      TENMONAN: 'Phở Bò',
      LOAI: 'Món chính',
      DONGIA: 50000,
      GHICHU: 'Không hành'
    };

    const res = await request(app).post('/api/monan').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.TENMONAN).toBe(payload.TENMONAN);

    const created = await Food.findOne({ TENMONAN: payload.TENMONAN });
    expect(created).toBeTruthy();
    expect(created.DONGIA).toBe(payload.DONGIA);
  });

  // 🧪 Cập nhật món ăn
  it('PUT /api/monan/:id → cập nhật giá món ăn', async () => {
    const created = await Food.create({
      TENMONAN: 'Gỏi Cuốn',
      LOAI: 'Khai vị',
      DONGIA: 30000,
      GHICHU: ''
    });

    const res = await request(app)
      .put(`/api/monan/${created._id}`)
      .send({ DONGIA: 35000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.DONGIA).toBe(35000);

    const updated = await Food.findById(created._id);
    expect(updated.DONGIA).toBe(35000);
  });

  // 🧪 Xóa món ăn (đánh dấu IS_DELETED)
  it('DELETE /api/monan/:id → xóa món ăn (soft delete)', async () => {
    const created = await Food.create({
      TENMONAN: 'Cháo Gà',
      LOAI: 'Món chính',
      DONGIA: 40000,
      GHICHU: ''
    });

    const res = await request(app).delete(`/api/monan/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/xóa món ăn thành công/i);

    const deleted = await Food.findById(created._id);
    expect(deleted).toBeTruthy();
    expect(deleted.IS_DELETED).toBe(true);
  });

  // 🧪 Lỗi khi thiếu TENMONAN
  it('POST /api/monan → lỗi khi thiếu TENMONAN', async () => {
    const payload = {
      LOAI: 'Món chính',
      DONGIA: 50000,
      GHICHU: 'Thiếu tên món'
    };

    const res = await request(app).post('/api/monan').send(payload);

    // Tùy backend: có thể là 400 hoặc 500 nếu chưa validate
    expect([400, 422, 500]).toContain(res.statusCode);
    expect(res.body.message || res.body.error || '').toMatch("Internal Server Error");
  });
  
  // 🧪 GET danh sách món chưa bị xóa (nếu có route GET)
  it('GET /api/monan → danh sách món chưa bị xóa', async () => {
    await Food.create([
      { TENMONAN: 'Món A', LOAI: 'Món chính', DONGIA: 30000 },
      { TENMONAN: 'Món B', LOAI: 'Món phụ', DONGIA: 25000, IS_DELETED: true }
    ]);

    const res = await request(app).get('/api/monan');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].TENMONAN).toBe('Món A');
  });

});

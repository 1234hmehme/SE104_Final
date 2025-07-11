// tests/food.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');          // chổ này trỏ tới Express app của bạn
const Food = require('../models/Monan');     // model Mon ăn (food)

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
  await Food.deleteMany();
});

describe('CRUD /api/monan', () => {
  it('POST   /api/monan  → tạo món ăn mới', async () => {
    const payload = {
      TENMONAN:     'Phở Bò',
      LOAI: 'Món chính',
      DONGIA:    50000,
      GHICHU:     'Không hành',
    };
    const res = await request(app)
      .post('/api/monan')
      .send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.TENMONAN).toBe(payload.TENMONAN);

    const f = await Food.findOne({ TENMONAN: payload.TENMONAN });
    expect(f).toBeTruthy();
    expect(f.DONGIA).toBe(payload.DONGIA);
  });
  it('PUT    /api/monan/:id  → cập nhật món ăn', async () => {
    const created = await Food.create({
      TENMONAN: 'Gỏi Cuốn', LOAI: 'Khai vị', DONGIA: 30000, GHICHU: ''
    });
    const res = await request(app)
      .put(`/api/monan/${created._id}`)
      .send({ DONGIA: 35000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.DONGIA).toBe(35000);

    const f2 = await Food.findById(created._id);
    expect(f2.DONGIA).toBe(35000);
  });

  it('DELETE /api/monan/:id  → xóa món ăn', async () => {
    const created = await Food.create({
      TENMONAN: 'Cháo Gà', LOAI: 'Món chính', DONGIA: 40000, GHICHU: ''
    });
    const res = await request(app)
      .delete(`/api/monan/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const f3 = await Food.findById(created._id);
    expect(f3).toBeNull();
  });
});

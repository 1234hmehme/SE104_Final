// tests/baocao.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');

const Baocao = require('../models/Baocao');

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
  await Baocao.deleteMany();
});

describe('CRUD /api/baocao', () => {

  // 1. Tạo mới hoặc cập nhật báo cáo
  it('1. POST /api/baocao → tạo mới nếu chưa có', async () => {
    const res = await request(app).post('/api/baocao').send({
      THANG: 7,
      NAM: 2025,
      DOANHTHU: 5000000
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.THANG).toBe(7);
    expect(res.body.NAM).toBe(2025);
    expect(res.body.DOANHTHU).toBe(5000000);

    const count = await Baocao.countDocuments();
    expect(count).toBe(1);
  });

  // 2. Cập nhật báo cáo nếu đã tồn tại (same THANG & NAM)
  it('2. POST /api/baocao → cập nhật nếu đã có', async () => {
    await Baocao.create({ THANG: 7, NAM: 2025, DOANHTHU: 3000000 });

    const res = await request(app).post('/api/baocao').send({
      THANG: 7,
      NAM: 2025,
      DOANHTHU: 8000000
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.DOANHTHU).toBe(8000000);

    const found = await Baocao.findOne({ THANG: 7, NAM: 2025 });
    expect(found.DOANHTHU).toBe(8000000);
  });

  // 3. Lấy toàn bộ báo cáo
  it('3. GET /api/baocao → trả về danh sách báo cáo', async () => {
    await Baocao.create([
      { THANG: 6, NAM: 2025, DOANHTHU: 1000000 },
      { THANG: 7, NAM: 2025, DOANHTHU: 3000000 }
    ]);

    const res = await request(app).get('/api/baocao');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  // 4. PUT /api/baocao/:id → cập nhật báo cáo theo ID
  it('4. PUT /api/baocao/:id → cập nhật thành công', async () => {
    const baocao = await Baocao.create({ THANG: 7, NAM: 2025, DOANHTHU: 4000000 });

    const res = await request(app).put(`/api/baocao/${baocao._id}`).send({ DOANHTHU: 6000000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.DOANHTHU).toBe(6000000);

    const updated = await Baocao.findById(baocao._id);
    expect(updated.DOANHTHU).toBe(6000000);
  });

  // 5. DELETE /api/baocao/:id → xoá báo cáo theo ID
  it('5. DELETE /api/baocao/:id → xoá thành công', async () => {
    const baocao = await Baocao.create({ THANG: 7, NAM: 2025, DOANHTHU: 2000000 });

    const res = await request(app).delete(`/api/baocao/${baocao._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const exists = await Baocao.findById(baocao._id);
    expect(exists).toBeNull();
  });

});

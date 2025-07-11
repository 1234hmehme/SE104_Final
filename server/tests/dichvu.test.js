// tests/service.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');             // Express app
const Service = require('../models/Dichvu');   // model Dịch vụ

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
  await Service.deleteMany();
});

describe('CRUD /api/dichvu', () => {
  it('POST   /api/dichvu  → tạo dịch vụ mới', async () => {
    const payload = {
      TENDICHVU: 'MC Chuyên nghiệp',
      GHICHU:    'Giá 3 triệu/tiệc',
      DONGIA:    3000000,
      DANHMUC:   'MC & Ca Sĩ',
    };
    const res = await request(app)
      .post('/api/dichvu')
      .send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.TENDICHVU).toBe(payload.TENDICHVU);

    const svc = await Service.findOne({ TENDICHVU: payload.TENDICHVU });
    expect(svc).toBeTruthy();
    expect(svc.DONGIA).toBe(payload.DONGIA);
  });

  it('PUT    /api/dichvu/:id  → cập nhật dịch vụ', async () => {
    const created = await Service.create({
      TENDICHVU: 'Ban nhạc sống',
      GHICHU:    '',
      DONGIA:    5000000,
      DANHMUC:   'Ban nhạc',
    });
    const res = await request(app)
      .put(`/api/dichvu/${created._id}`)
      .send({ GHICHU: 'Giá 5 triệu/tiệc', DONGIA: 5500000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.GHICHU).toBe('Giá 5 triệu/tiệc');
    expect(res.body.DONGIA).toBe(5500000);

    const s2 = await Service.findById(created._id);
    expect(s2.DONGIA).toBe(5500000);
  });

  it('DELETE /api/dichvu/:id  → xóa dịch vụ', async () => {
    const created = await Service.create({
      TENDICHVU: 'Chụp ảnh cưới',
      GHICHU:    '',
      DONGIA:    2000000,
      DANHMUC:   'Quay Chụp',
    });
    const res = await request(app)
      .delete(`/api/dichvu/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const s3 = await Service.findById(created._id);
    expect(s3).toBeNull();
  });
});

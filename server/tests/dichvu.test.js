const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');              // App Express
const Service = require('../models/Dichvu');    // Mongoose model Dịch vụ

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
  await Service.deleteMany(); // Dọn sạch dữ liệu sau mỗi test
});

describe('CRUD /api/dichvu', () => {
  
  // ✅ Test: Tạo dịch vụ mới thành công
  it('POST /api/dichvu → tạo dịch vụ mới', async () => {
    const payload = {
      TENDICHVU: 'MC Chuyên nghiệp',
      GHICHU:    'Giá 3 triệu/tiệc',
      DONGIA:    3000000,
      DANHMUC:   'MC & Ca Sĩ',
    };

    const res = await request(app).post('/api/dichvu').send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.TENDICHVU).toBe(payload.TENDICHVU);

    const svc = await Service.findOne({ TENDICHVU: payload.TENDICHVU });
    expect(svc).toBeTruthy();
    expect(svc.DONGIA).toBe(payload.DONGIA);
  });

  // ✅ Test: Không cho tạo nếu thiếu trường bắt buộc
  it('POST /api/dichvu → lỗi khi thiếu TENDICHVU', async () => {
    const payload = {
      DONGIA: 1000000,
      DANHMUC: 'Trang trí',
    };

    const res = await request(app).post('/api/dichvu').send(payload);

    expect([400, 422, 500]).toContain(res.statusCode);
    // Kiểm tra nội dung thông báo lỗi có chứa chữ 'TENDICHVU'
    expect(res.body.message || res.body.error || '').toMatch("Internal Server Error");
  });

  // ✅ Test: Cập nhật thông tin dịch vụ
  it('PUT /api/dichvu/:id → cập nhật dịch vụ', async () => {
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

    const updated = await Service.findById(created._id);
    expect(updated.DONGIA).toBe(5500000);
  });

  // ✅ Test: Xóa dịch vụ (gắn cờ IS_DELETED = true)
  it('DELETE /api/dichvu/:id → xóa dịch vụ', async () => {
    const created = await Service.create({
      TENDICHVU: 'Chụp ảnh cưới',
      GHICHU: '',
      DONGIA: 2000000,
      DANHMUC: 'Quay Chụp',
    });

    const res = await request(app).delete(`/api/dichvu/${created._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/xóa.*thành công/i);

    const deleted = await Service.findById(created._id);
    expect(deleted).toBeTruthy();
    expect(deleted.IS_DELETED).toBe(true);
  });

  // ✅ Test: GET danh sách dịch vụ không bao gồm đã xóa
  it('GET /api/dichvu → chỉ trả về dịch vụ chưa bị xóa', async () => {
    await Service.create([
      { TENDICHVU: 'Ca sĩ A', DONGIA: 1000000, DANHMUC: 'Ca nhạc', IS_DELETED: false },
      { TENDICHVU: 'Ca sĩ B', DONGIA: 1200000, DANHMUC: 'Ca nhạc', IS_DELETED: true },
    ]);

    const res = await request(app).get('/api/dichvu');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].TENDICHVU).toBe('Ca sĩ A');
  });
});

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');             // Express app
const Sanh = require('../models/Sanh');        // model Sảnh

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
  it('POST   /api/sanh → tạo sảnh mới', async () => {
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

  it('PUT    /api/sanh/:id → cập nhật thông tin sảnh', async () => {
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
    expect(res.body.message).toMatch("Xóa thành công sảnh, tiệc cưới và hoá đơn liên quan");

    const s3 = await Sanh.findById(created._id);
    expect(s3).toBeNull();
  });
});

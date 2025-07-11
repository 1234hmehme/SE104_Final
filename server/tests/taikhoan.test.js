const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require("../apptest");
const Taikhoan = require('../models/Taikhoan');

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
  await Taikhoan.deleteMany(); // Xoá dữ liệu sau mỗi test
});

describe('POST /api/taikhoan', () => {
  it('Đăng ký thành công với tài khoản mới', async () => {
    const res = await request(app).post('/api/taikhoan').send({
      TenDangNhap: 'user1',
      MatKhau: '123456',
      HoTen: 'Nguyễn Văn A'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Đăng ký thành công, chờ duyệt!');
    expect(res.body.data.TenDangNhap).toBe('user1');
    const account = await Taikhoan.findOne({ TenDangNhap: 'user1' });
    expect(account).toBeTruthy();
    expect(account.DaDuyet).toBe(false);
    expect(account.LoaiTK).toBe('NhanVien');
  });
  it('Không cho đăng ký nếu thiếu thông tin', async () => {
    const res = await request(app).post('/api/taikhoan').send({
      TenDangNhap: 'user2'
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Lỗi đăng ký');
  });
});

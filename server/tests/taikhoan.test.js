const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../apptest');
const Taikhoan = require('../models/Taikhoan');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Taikhoan.deleteMany();
});

describe('Tài khoản - Đăng ký, đăng nhập, duyệt, xóa', () => {
  it('1. Đăng ký thành công', async () => {
    const res = await request(app).post('/api/taikhoan').send({
      TenDangNhap: 'user1',
      MatKhau: '123456',
      HoTen: 'Nguyễn Văn A'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/thành công/i);

    const account = await Taikhoan.findOne({ TenDangNhap: 'user1' });
    expect(account).toBeTruthy();
    expect(account.DaDuyet).toBe(false);
    expect(account.LoaiTK).toBe('NhanVien');
  });

  it('2. Không cho đăng ký nếu thiếu thông tin', async () => {
    const res = await request(app).post('/api/taikhoan').send({ TenDangNhap: 'user2' });
    expect([400, 422, 500]).toContain(res.statusCode);
    expect(res.body.error || res.body.message).toMatch(/lỗi/i);
  });

  it('3. Không cho đăng ký nếu trùng TenDangNhap', async () => {
    await request(app).post('/api/taikhoan').send({
      TenDangNhap: 'user1',
      MatKhau: '123456',
      HoTen: 'Nguyễn Văn A'
    });

    const res = await request(app).post('/api/taikhoan').send({
      TenDangNhap: 'user1',
      MatKhau: 'abc123',
      HoTen: 'Trùng tên'
    });

    expect([400, 422, 500]).toContain(res.statusCode);
    expect(res.body.error || res.body.message).toMatch("Lỗi đăng ký" );
  });

  it('4. Đăng nhập thất bại nếu chưa duyệt', async () => {
    await request(app).post('/api/taikhoan').send({
      TenDangNhap: 'user2',
      MatKhau: '123456',
      HoTen: 'Nguyễn Văn B'
    });

    const res = await request(app).post('/api/taikhoan/login').send({
      TenDangNhap: 'user2',
      MatKhau: '123456'
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/chưa được duyệt/i);
  });

  it('5. Đăng nhập thành công khi đã được duyệt', async () => {
    const acc = await Taikhoan.create({
      TenDangNhap: 'user3',
      MatKhau: '123456',
      HoTen: 'Nguyễn Văn C',
      DaDuyet: true
    });

    const res = await request(app).post('/api/taikhoan/login').send({
      TenDangNhap: 'user3',
      MatKhau: '123456'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/thành công/i);
    expect(res.body.username).toBe('user3');
  });

  it('6. Đăng nhập thất bại nếu sai mật khẩu', async () => {
    await Taikhoan.create({
      TenDangNhap: 'user4',
      MatKhau: '123456',
      HoTen: 'Nguyễn Văn D',
      DaDuyet: true
    });

    const res = await request(app).post('/api/taikhoan/login').send({
      TenDangNhap: 'user4',
      MatKhau: 'sai123'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/sai/i);
  });

  it('7. Đăng nhập thất bại nếu không tồn tại tài khoản', async () => {
    const res = await request(app).post('/api/taikhoan/login').send({
      TenDangNhap: 'khongtontai',
      MatKhau: '123456'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/sai/i);
  });

  it('8. Duyệt tài khoản thành công', async () => {
    const acc = await Taikhoan.create({
      TenDangNhap: 'user5',
      MatKhau: '123456',
      HoTen: 'Nguyễn Văn E'
    });

    const res = await request(app).put(`/api/taikhoan/duyet/${acc._id}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/duyệt/i);

    const updated = await Taikhoan.findById(acc._id);
    expect(updated.DaDuyet).toBe(true);
  });

  it('9. Xoá tài khoản bị từ chối', async () => {
    const acc = await Taikhoan.create({
      TenDangNhap: 'user6',
      MatKhau: '123456',
      HoTen: 'Nguyễn Văn F'
    });

    const res = await request(app).delete(`/api/taikhoan/${acc._id}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/xoá/i);

    const check = await Taikhoan.findById(acc._id);
    expect(check).toBeNull();
  });

  it('10. Lấy danh sách tài khoản', async () => {
    await Taikhoan.create({
      TenDangNhap: 'admin',
      MatKhau: 'admin123',
      HoTen: 'Quản trị viên',
      LoaiTK: 'Admin',
      DaDuyet: true
    });

    const res = await request(app).get('/api/taikhoan');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

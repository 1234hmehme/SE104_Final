const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const TaikhoanSchema = new mongoose.Schema({
  TenDangNhap: {
    type: String,
    required: true,
    unique: true
  },
  MatKhau: {
    type: String,
    required: true
  },
  HoTen: {
    type: String,
    required: true
  },
  LoaiTK: {
    type: String,
    required: true,
    enum: ['Admin', 'NhanVien'],
    default: 'NhanVien'  // Mặc định là nhân viên khi đăng ký
  },
  DaDuyet: {
    type: Boolean,
    default: false        // Mặc định chưa được admin duyệt
  }
});

// Hash mật khẩu trước khi lưu
TaikhoanSchema.pre('save', async function (next) {
  if (!this.isModified('MatKhau')) return next(); // chỉ hash nếu password bị thay đổi
  try {
    const salt = await bcrypt.genSalt(10);
    this.MatKhau = await bcrypt.hash(this.MatKhau, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Taikhoan = mongoose.model('Taikhoan', TaikhoanSchema);
module.exports = Taikhoan;

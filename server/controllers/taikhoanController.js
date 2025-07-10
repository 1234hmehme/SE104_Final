const Taikhoan = require('../models/Taikhoan');
const bcrypt = require('bcrypt');

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { TenDangNhap, MatKhau, HoTen } = req.body;

    const newTaikhoan = new Taikhoan({
      TenDangNhap,
      MatKhau,
      HoTen,
      LoaiTK: 'NhanVien',
      DaDuyet: false
    });

    const result = await newTaikhoan.save();
    res.status(201).json({ message: 'Đăng ký thành công, chờ duyệt!', data: result });

  } catch (error) {
    res.status(500).json({ error: 'Lỗi đăng ký', details: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { TenDangNhap, MatKhau } = req.body;

  try {
    const user = await Taikhoan.findOne({ TenDangNhap });

    if (!user || !(await bcrypt.compare(MatKhau, user.MatKhau)))
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });

    if (!user.DaDuyet)
      return res.status(403).json({ message: 'Tài khoản chưa được duyệt' });

    res.status(200).json({ message: 'Đăng nhập thành công', username: user.TenDangNhap, role: user.LoaiTK });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
};

// Duyệt tài khoản
exports.approveAccount = async (req, res) => {
  try {
    const user = await Taikhoan.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    user.DaDuyet = true;
    await user.save();

    res.status(200).json({ message: 'Tài khoản đã được duyệt' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
};

// Xoá tài khoản (khi admin từ chối)
exports.deleteAccount = async (req, res) => {
  try {
    const user = await Taikhoan.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản để xoá' });

    res.status(200).json({ message: 'Tài khoản đã bị từ chối và xoá' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xoá tài khoản', details: error.message });
  }
};

// Lấy danh sách tài khoản (admin)
exports.getall = async (req, res) => {
  try {
    const danhSach = await Taikhoan.find();
    res.status(200).json(danhSach);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách', details: error.message });
  }
};

const mongoose = require('mongoose');
require('dotenv').config(); // nếu dùng .env

const Sanh = require('./models/Sanh'); // đường dẫn đến model của bạn

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await Sanh.updateMany(
      { HINHANH_ID: { $exists: false } }, // chỉ cập nhật nếu chưa có
      { $set: { HINHANH_ID: "" } }
    );

    console.log(`✅ Đã cập nhật ${result.modifiedCount} dịch vụ thêm HINHANH_ID: ""`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật:', err);
    process.exit(1);
  }
};

run();
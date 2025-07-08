const mongoose = require('mongoose');

const BaocaoSchema = new mongoose.Schema({
  THANG: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  NAM: {
    type: Number,
    required: true,
    min: 2000,
  },
  DOANHTHU: {
    type: Number,
    required: true,
    min: 0,
  },
});

// ✅ Thêm chỉ mục unique để ngăn báo cáo trùng tháng + năm
BaocaoSchema.index({ THANG: 1, NAM: 1 }, { unique: true });

const Baocao = mongoose.model('Baocao', BaocaoSchema);
module.exports = Baocao;

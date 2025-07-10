const mongoose = require('mongoose')

const SanhSchema = new mongoose.Schema({
  TENSANH: {
    type: String,
    require: true,
  },
  LOAISANH: {
    type: String,
    required: true
  },
  SOLUONGBANTD: {
    type: Number,
    required: true
  },
  DONGIABANTT: {
    type: Number,
    required: true
  },
  GHICHU: {
    type: String,
    required: true
  },
  HINHANH: {
    type: String,
    default: ""
  }
})

const Sanh =mongoose.model('Sanh',SanhSchema);
module.exports = Sanh;

const mongoose = require('mongoose')

const HoadonSchema = new mongoose.Schema({
  MATIEC: {
    type: String,
    required: true,
    ref: 'Tieccuoi'
  },
  NGAYTHANHTOAN: {
    type: Date,
    required: true,
    default: Date.now
  },
  SOTIENHOADON: {
    type: Number,
    default: 0,
    min: 0
  },
  TIENBAN: {
    type: Number,
    default: 0,
    min: 0
  },
  TIENDICHVU: {
    type: Number,
    default: 0,
    min: 0
  },
  TIENPHAT: {
    type: Number,
    default: 0,
    min: 0
  },
  LOAIHOADON: {
    type: String,
    enum: ["Đặt cọc", "Thanh toán"],
    default: "Đặt cọc"
  },

})

const Hoadon = mongoose.model('Hoadon', HoadonSchema);
module.exports = Hoadon;
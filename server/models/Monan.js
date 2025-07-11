const mongoose = require('mongoose')

const MonanSchema = new mongoose.Schema({
  TENMONAN: {
    type: String,
    required: true
  },
  DONGIA: {
    type: Number,
    required: true
  },
  GHICHU: {
    type: String,
    default: ""
  },
  LOAI: {
    type: String,
    required: true
  },
  HINHANH: {
    type: String,
    default: ""
  },
  HINHANH_ID: {
    type: String,
    default: ""
  },
  IS_DELETED: {
    type: Boolean,
    default: false
  },
})

const Monan = mongoose.model('Monan', MonanSchema);
module.exports = Monan;
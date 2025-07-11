const mongoose = require('mongoose')

const DichvuSchema = new mongoose.Schema({
  TENDICHVU: {
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
  DANHMUC: {
    type: String,
    required: false
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

const Dichvu = mongoose.model('Dichvu', DichvuSchema);
module.exports = Dichvu;
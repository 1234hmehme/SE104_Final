const mongoose = require('mongoose')

const ChitietmonanSchema = new mongoose.Schema({
  MATIEC: {
    type: String,
    required: true,
    ref: 'Tieccuoi'
  },
  MAMONAN: {
    type: String,
    required: true,
    ref: 'Monan'
  },
  GIATIEN: {
    type: Number,
    required: true,
    min: 0
  },
  GHICHU: {
    type: String
  }
})

ChitietmonanSchema.index({ MATIEC: 1, MAMONAN: 1 }, { unique: true });

const Chitietmonan = mongoose.model('Chitietmonan', ChitietmonanSchema);
module.exports = Chitietmonan;
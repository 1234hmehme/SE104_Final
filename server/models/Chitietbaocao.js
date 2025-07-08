const mongoose = require('mongoose');

const ChitietbaocaoSchema = new mongoose.Schema({
  MaBaoCao: {
    type: String,
    required: true,
    ref: 'Baocao'
  },
  Ngay: {
    type: Date,
    required: true
  },
  SoLuongTieccuoi: {
    type: Number,
    required: true,
    min: 0
  },
  DoanhThu: {
    type: Number,
    required: true,
    min: 0
  },
  TyLe: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

const Chitietbaocao = mongoose.model('Chitietbaocao', ChitietbaocaoSchema);
module.exports = Chitietbaocao;

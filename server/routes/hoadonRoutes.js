const express = require('express');
const router = express.Router();
const Hoadon = require('./../models/Hoadon');

const Tieccuoi = require('../models/Tieccuoi');
const Baocao = require('../models/Baocao');
const Chitietbaocao = require('../models/Chitietbaocao');

// Tạo hóa đơn + cập nhật bảng Chitietbaocao
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newHoadon = new Hoadon(data);
    const response = await newHoadon.save();
    console.log('Hóa đơn đã được lưu');

    // ✅ Sau khi lưu hóa đơn, cập nhật bảng Chitietbaocao
    const tiec = await Tieccuoi.findById(data.MaTiecCuoi);
    if (tiec) {
      const ngay = tiec.NgayDaiTiec;
      const thang = ngay.getMonth() + 1;
      const nam = ngay.getFullYear();
      const maBaoCao = `BC${thang.toString().padStart(2, '0')}${nam}`;

      const tiecsTrongNgay = await Tieccuoi.find({ NgayDaiTiec: ngay });
      const soLuong = tiecsTrongNgay.length;
      const doanhThu = tiecsTrongNgay.reduce((sum, t) => sum + (t.TongTien || 0), 0);

      const baoCaoThang = await Baocao.findOne({ MaBaoCao: maBaoCao });
      const tongThang = baoCaoThang?.TongDoanhThu || 1;
      const tyLe = +(doanhThu / tongThang * 100).toFixed(2);

      const existing = await Chitietbaocao.findOne({ Ngay: ngay });
      if (existing) {
        await Chitietbaocao.updateOne(
          { Ngay: ngay },
          {
            $set: {
              SoLuongTieccuoi: soLuong,
              DoanhThu: doanhThu,
              TyLe: tyLe
            }
          }
        );
        console.log(`✔️ Đã cập nhật Chitietbaocao ngày ${ngay.toISOString().slice(0, 10)}`);
      } else {
        await Chitietbaocao.create({
          MaBaoCao: maBaoCao,
          Ngay: ngay,
          SoLuongTieccuoi: soLuong,
          DoanhThu: doanhThu,
          TyLe: tyLe
        });
        console.log(`✅ Đã tạo mới Chitietbaocao ngày ${ngay.toISOString().slice(0, 10)}`);
      }
    }

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Lấy toàn bộ hóa đơn
router.get('/', async (req, res) => {
  try {
    const data = await Hoadon.find();
    console.log('Data fetched');
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Cập nhật hóa đơn
router.put('/:id', async (req, res) => {
  try {
    const hoadonId = req.params.id;
    const updatedHoadonData = req.body;

    const response = await Hoadon.findByIdAndUpdate(hoadonId, updatedHoadonData, {
      new: true,
      runValidators: true
    });

    if (!response) {
      return res.status(404).json({ error: 'Hóa đơn not found' });
    }

    console.log('Data updated');
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Xoá hóa đơn
router.delete('/:id', async (req, res) => {
  try {
    const hoadonId = req.params.id;
    const response = await Hoadon.findByIdAndDelete(hoadonId);

    if (!response) {
      return res.status(404).json({ error: 'Hóa đơn not found' });
    }

    console.log('Data deleted');
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;

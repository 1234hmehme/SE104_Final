const Hoadon = require('../models/Hoadon');
const Tieccuoi = require('../models/Tieccuoi');
const Chitietbaocao = require('../models/Chitietbaocao');

exports.getAll = async () => {
    const hoadons = await Hoadon.aggregate([
        {
            $lookup: {
                from: 'tieccuois',
                localField: 'MATIEC',
                foreignField: 'MATIEC',
                as: 'tieccuoiInfo',
            }
        },
        {
            $unwind: {
                path: '$tieccuoiInfo',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $addFields: {
                TENCR: '$tieccuoiInfo.TENCR',
                TENCD: '$tieccuoiInfo.TENCD',
            },
        },
        {
            $project: {
                tieccuoiInfo: 0, // ẩn object gốc nếu không cần
            },
        },

    ]);

    return hoadons;

    /*const result = hoadons.map(hoadon => ({
        ...hoadon,
        TENCR: hoadon.MATIEC?.TENCR,
        TENCD: hoadon.MATIEC.TENCD,
    }));
    return result;*/
};

exports.create = async (data) => {
    const newHoadon = new Hoadon(data);
    const saved = await newHoadon.save();

    const tiec = await Tieccuoi.findById(data.MATIEC);
    if (!tiec) throw new Error('Không tìm thấy tiệc cưới để cập nhật báo cáo');

    const ngay = new Date(tiec.NGAYDAI);
    ngay.setHours(0, 0, 0, 0);
    const thang = ngay.getMonth() + 1;
    const nam = ngay.getFullYear();
    const maBaoCao = `BC${thang.toString().padStart(2, '0')}${nam}`;

    const tiecsTrongNgay = await Tieccuoi.find({ NGAYDAI: ngay });
    const soLuong = tiecsTrongNgay.length;

    const maTiecList = tiecsTrongNgay.map(t => t.MATIEC);

    const hoadons = await Hoadon.find({ MATIEC: { $in: maTiecList } });
    const doanhThu = hoadons.reduce((sum, h) => sum + h.TONGTIEN, 0);

    const existing = await Chitietbaocao.findOne({ Ngay: ngay });
    if (existing) {
        await Chitietbaocao.updateOne(
            { Ngay: ngay },
            {
                $set: {
                    SoLuongTieccuoi: soLuong,
                    DoanhThu: doanhThu
                }
            }
        );
    } else {
        await Chitietbaocao.create({
            MaBaoCao: maBaoCao,
            Ngay: ngay,
            SoLuongTieccuoi: soLuong,
            DoanhThu: doanhThu
        });
    }

    return saved;
};

exports.update = async (id, data) => {
    const updated = await Hoadon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) throw new Error('Hóa đơn không tồn tại');
    return updated;
};

exports.remove = async (id) => {
    const deleted = await Hoadon.findByIdAndDelete(id);
    if (!deleted) throw new Error('Hóa đơn không tồn tại');
    return { message: 'Xóa hóa đơn thành công' };
};

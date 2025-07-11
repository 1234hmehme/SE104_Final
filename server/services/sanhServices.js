const Sanh = require('../models/Sanh');
const Tieccuoi = require('../models/Tieccuoi');
const Hoadon = require('../models/Hoadon');
const cloudinary = require('cloudinary').v2;

exports.create = async (data, file) => {
    if (file) {
        data.HINHANH = file.path;               // secure_url đã có sẵn
        data.HINHANH_ID = file.filename;        // public_id
    }

    const newSanh = new Sanh(data);
    return await newSanh.save();
};

exports.getAll = async () => {
    return await Sanh.find();
};

exports.update = async (id, updateData, file) => {
    const sanh = await Sanh.findById(id);
    if (!sanh) throw new Error('Sảnh không tồn tại');

    if (file) {
        if (sanh.HINHANH_ID) {
            await cloudinary.uploader.destroy(sanh.HINHANH_ID);
        }

        updateData.HINHANH = file.path;
        updateData.HINHANH_ID = file.filename;
    }

    const updated = await Sanh.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) throw new Error('Sảnh không tồn tại');
    return updated;
};

exports.remove = async (hallId) => {
    const parties = await Tieccuoi.find({ MASANH: hallId }).select('MATIEC');
    const partyCodes = parties.map(p => p.MATIEC);

    const deletedHall = await Sanh.findByIdAndDelete(hallId);
    if (!deletedHall) throw new Error('Sảnh không tồn tại');

    if (deletedHall.HINHANH_ID) {
        await cloudinary.uploader.destroy(deletedHall.HINHANH_ID);
    }

    const { deletedCount: deletedPartiesCount } = await Tieccuoi.deleteMany({ MASANH: hallId });
    const { deletedCount: deletedInvoicesCount } = await Hoadon.deleteMany({ MATIEC: { $in: partyCodes } });

    return {
        message: 'Xóa thành công sảnh, tiệc cưới và hoá đơn liên quan',
        deletedParties: deletedPartiesCount,
        deletedInvoices: deletedInvoicesCount,
    };
};
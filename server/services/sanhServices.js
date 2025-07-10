const Sanh = require('../models/Sanh');
const Tieccuoi = require('../models/Tieccuoi');
const Hoadon = require('../models/Hoadon');

exports.create = async (data) => {
    const newSanh = new Sanh(data);
    return await newSanh.save();
};

exports.getAll = async () => {
    return await Sanh.find();
};

exports.update = async (id, updateData) => {
    const updated = await Sanh.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) throw new Error('Sảnh không tồn tại');
    return updated;
};

exports.remove = async (hallId) => {
    const parties = await Tieccuoi.find({ MASANH: hallId }).select('MATIEC');
    const partyCodes = parties.map(p => p.MATIEC);

    const deletedHall = await Sanh.findByIdAndDelete(hallId);
    if (!deletedHall) throw new Error('Sảnh không tồn tại');

    const { deletedCount: deletedPartiesCount } = await Tieccuoi.deleteMany({ MASANH: hallId });
    const { deletedCount: deletedInvoicesCount } = await Hoadon.deleteMany({ MATIEC: { $in: partyCodes } });

    return {
        message: 'Xóa thành công sảnh, tiệc cưới và hoá đơn liên quan',
        deletedParties: deletedPartiesCount,
        deletedInvoices: deletedInvoicesCount,
    };
};
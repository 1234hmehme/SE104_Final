const Sanh = require('../models/Sanh');
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
    return await Sanh.find({ IS_DELETED: false });
};

exports.update = async (id, updateData, file) => {
    const sanh = await Sanh.findById(id);
    if (!sanh) throw new Error('Sảnh không tồn tại');

    if (file) {
        if (sanh.HINHANH_ID !== "") {
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
    const deletedHall = await Sanh.findById(hallId);
    if (!deletedHall) throw new Error('Sảnh không tồn tại');

    // ❌ Không xoá khỏi DB
    deletedHall.IS_DELETED = true;
    await deletedHall.save();

    return {
        message: 'Xóa sảnh thành công',
    };
};
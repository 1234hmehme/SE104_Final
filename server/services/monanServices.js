const Monan = require('./../models/Monan');
const cloudinary = require('cloudinary').v2;

exports.create = async (data, file) => {
    if (file) {
        data.HINHANH = file.path;               // secure_url đã có sẵn
        data.HINHANH_ID = file.filename;        // public_id
    }

    const newMonan = new Monan(data);
    return await newMonan.save();
};

exports.getAll = async () => {
    return await Monan.find({ IS_DELETED: false });
};

exports.update = async (id, updateData, file) => {
    const monan = await Monan.findById(id);
    if (!monan) throw new Error('Món ăn không tồn tại');

    if (file) {
        if (monan.HINHANH_ID !== "") {
            await cloudinary.uploader.destroy(monan.HINHANH_ID);
        }

        updateData.HINHANH = file.path;
        updateData.HINHANH_ID = file.filename;
    }

    const updated = await Monan.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) throw new Error('Món ăn không tồn tại');
    return updated;
};

exports.remove = async (foodId) => {
    const deletedFood = await Monan.findById(foodId);
    if (!deletedFood) throw new Error('Món ăn không tồn tại');

    // ❌ Không xoá khỏi DB
    deletedFood.IS_DELETED = true;
    await deletedFood.save();

    return {
        message: 'Xóa món ăn thành công',
    };
};
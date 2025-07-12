const Dichvu = require('./../models/Dichvu');
const cloudinary = require('cloudinary').v2;

exports.create = async (data, file) => {
    if (file) {
        data.HINHANH = file.path;               // secure_url đã có sẵn
        data.HINHANH_ID = file.filename;        // public_id
    }

    const newDichvu = new Dichvu(data);
    return await newDichvu.save();
};

exports.getAll = async () => {
    return await Dichvu.find({ IS_DELETED: false });
};

exports.update = async (id, updateData, file) => {
    const dichvu = await Dichvu.findById(id);
    if (!dichvu) throw new Error('Dịch vụ không tồn tại');

    if (file) {
        if (dichvu.HINHANH_ID !== "") {
            await cloudinary.uploader.destroy(dichvu.HINHANH_ID);
        }

        updateData.HINHANH = file.path;
        updateData.HINHANH_ID = file.filename;
    }

    const updated = await Dichvu.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) throw new Error('Dịch vụ không tồn tại');
    return updated;
};

exports.remove = async (serviceId) => {
    const deletedService = await Dichvu.findById(serviceId);
    if (!deletedService) throw new Error('Dịch vụ không tồn tại');

    // ❌ Không xoá khỏi DB
    deletedService.IS_DELETED = true;
    await deletedService.save();

    return {
        message: 'Xóa dịch vụ thành công',
    };
};
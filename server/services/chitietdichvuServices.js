const Chitietdichvu = require('../models/Chitietdichvu');

exports.create = async (data) => {
    const newChitietdichvu = new Chitietdichvu(data);
    return await newChitietdichvu.save();
};

exports.getAll = async () => {
    return await Chitietdichvu.find();
};

exports.getAllByParty = async (maTiec) => {
  const ctdvList = await Chitietdichvu.find({ MATIEC: maTiec }).populate('MADICHVU', 'TENDICHVU').lean();
  const result = ctdvList.map(ctdv => ({
    ...ctdv,
    TENDICHVU: ctdv.MADICHVU?.TENDICHVU,
    MADICHVU: ctdv.MADICHVU?._id  // hoặc để nguyên
  }));
  return result;
};

exports.update = async (chitietdichvuId, updatedChitietdichvuData) => {
    const response = await Chitietdichvu.findByIdAndUpdate(chitietdichvuId, updatedChitietdichvuData,{
      new: true,
      runValidators: true
    })
    if (!response) throw new Error('Chi tiết dịch vụ không tồn tại');
    return response;
};

exports.remove = async (chitietdichvuId) => {
    const response = await Chitietdichvu.findByIdAndDelete(chitietdichvuId)
    if (!response) throw new Error('Chi tiết dịch vụ không tồn tại');

    return {
        message: 'Xóa chi tiết dịch vụ thành công',
    };
};
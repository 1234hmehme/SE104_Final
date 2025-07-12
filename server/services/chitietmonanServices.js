const Chitietmonan = require('../models/Chitietmonan');

exports.getAllByParty = async (maTiec) => {
  const ctmaList = await Chitietmonan.find({ MATIEC: maTiec }).populate('MAMONAN', 'TENMONAN LOAI').lean();
  const result = ctmaList.map(ctma => ({
    ...ctma,
    TENMONAN: ctma.MAMONAN?.TENMONAN,
    LOAI: ctma.MAMONAN?.LOAI,
    MAMONAN: ctma.MAMONAN?._id  // hoặc để nguyên
  }));
  return result;
};

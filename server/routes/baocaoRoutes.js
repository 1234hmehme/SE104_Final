const express = require('express');
const router = express.Router();
const Baocao = require('./../models/Baocao')

router.post('/', async (req, res) => {
  try {
    const { THANG, NAM, DOANHTHU } = req.body;

    const response = await Baocao.findOneAndUpdate(
      { THANG, NAM },                  // tìm theo tháng và năm
      { $set: { DOANHTHU } },          // cập nhật doanh thu
      { upsert: true, new: true }      // nếu chưa có thì tạo mới
    );

    console.log('Báo cáo đã lưu hoặc cập nhật');
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Lỗi khi lưu báo cáo', details: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await Baocao.find(); 
    console.log('Data fetched');
    res.status(200).json(data); 
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

router.put('/:id', async (req,res)=> {
  try {
    const baocaoId = req.params.id;
    const updatedBaocaoData = req.body;

    const response = await Baocao.findByIdAndUpdate(baocaoId, updatedBaocaoData,{
      new: true,
      runValidators: true
    })
    if (!response) {
      return res.status(404).json({error: 'Báo cáo not found'})
    }
    console.log('data updated')
    res.status(200).json(response)
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message }); 
  }
})

router.delete('/:id', async (req,res)=> {
  try {
    const baocaoId = req.params.id;
    const response = await Baocao.findByIdAndDelete(baocaoId)
    if (!response) {
      return res.status(404).json({error: 'Báo cáo not found'})
    }
    console.log('data delete')
    res.status(200).json({message: 'deleted successfully'})
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message }); 
  }
})

module.exports = router
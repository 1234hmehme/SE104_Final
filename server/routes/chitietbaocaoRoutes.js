const express = require('express');
const router = express.Router();
const Chitietbaocao = require('./../models/Chitietbaocao');

// CREATE - POST
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newChitietbaocao = new Chitietbaocao(data);
    const response = await newChitietbaocao.save();
    console.log('Chitietbaocao saved');
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// READ - GET all
router.get('/', async (req, res) => {
  try {
    const data = await Chitietbaocao.find();
    console.log('Chitietbaocao fetched');
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// UPDATE - PUT by ID
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const response = await Chitietbaocao.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!response) {
      return res.status(404).json({ error: 'Chi tiết báo cáo not found' });
    }

    console.log('Chitietbaocao updated');
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// DELETE - DELETE by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await Chitietbaocao.findByIdAndDelete(id);

    if (!response) {
      return res.status(404).json({ error: 'Chi tiết báo cáo not found' });
    }

    console.log('Chitietbaocao deleted');
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;

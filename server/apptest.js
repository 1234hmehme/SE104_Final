const express = require('express');
const datab = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');
const corsMiddleware = require('./cors-config');

const app = express();
app.use(bodyParser.json());
app.use(corsMiddleware);

// Import routes
const sanhRoutes = require('./routes/sanhRoutes');
const tieccuoiRoutes = require('./routes/tieccuoiRoutes');
const monanRoutes = require('./routes/monanRoutes');
const dichvuRoutes = require('./routes/dichvuRoutes');
const taikhoanRoutes = require('./routes/taikhoanRoutes');
const chitietmonanRoutes = require('./routes/chitietmonanRoutes');
const chitietdichvuRoutes = require('./routes/chitietdichvuRoutes');
const hoadonRoutes = require('./routes/hoadonRoutes');
const baocaoRoutes = require('./routes/baocaoRoutes');
const chitietbaocaoRoutes = require('./routes/chitietbaocaoRoutes');

// Sử dụng routes
app.use('/api/sanh', sanhRoutes);
app.use('/api/tieccuoi', tieccuoiRoutes);
app.use('/api/monan', monanRoutes);
app.use('/api/dichvu', dichvuRoutes);
app.use('/api/taikhoan', taikhoanRoutes);
app.use('/api/chitietmonan', chitietmonanRoutes);
app.use('/api/chitietdichvu', chitietdichvuRoutes);
app.use('/api/hoadon', hoadonRoutes);
app.use('/api/baocao', baocaoRoutes);
app.use('/api/chitietbaocao', chitietbaocaoRoutes);

module.exports = app; // Xuất để supertest dùng

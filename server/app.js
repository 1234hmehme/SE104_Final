const express = require('express')
const datab = require('./db')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json())
require('dotenv').config()
const corsMiddleware = require('./cors-config')

// Áp dụng CORS middleware
app.use(corsMiddleware)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const PORT = process.env.PORT || 3000





const sanhRoutes = require('./routes/sanhRoutes')
const tieccuoiRoutes = require('./routes/tieccuoiRoutes')
const monanRoutes = require('./routes/monanRoutes')
const dichvuRoutes = require('./routes/dichvuRoutes')
const taikhoanRoutes = require('./routes/taikhoanRoutes')
const chitietmonanRoutes = require('./routes/chitietmonanRoutes')
const chitietdichvuRoutes = require('./routes/chitietdichvuRoutes')
const hoadonRoutes = require('./routes/hoadonRoutes')
const baocaoRoutes = require('./routes/baocaoRoutes')
const chitietbaocaoRoutes = require('./routes/chitietbaocaoRoutes');



app.use('/api/sanh', sanhRoutes)
app.use('/api/tieccuoi', tieccuoiRoutes)
app.use('/api/monan', monanRoutes)
app.use('/api/dichvu', dichvuRoutes)
app.use('/api/taikhoan', taikhoanRoutes)
app.use('/api/chitietmonan', chitietmonanRoutes)
app.use('/api/chitietdichvu', chitietdichvuRoutes)
app.use('/api/hoadon', hoadonRoutes)
app.use('/api/baocao', baocaoRoutes)
app.use('/api/chitietbaocao', chitietbaocaoRoutes);



app.listen(PORT, () => {
  console.log('Server đang chạy trên port', PORT)
})
require('dotenv').config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGODB_URL;

// Nếu đang chạy test thì không kết nối
if (process.env.NODE_ENV === 'test') {
  console.log('Skipping DB connection in test mode');
  module.exports = {}; // chỉ export rỗng
} else {
  mongoose.connect(mongoURL);

  const datab = mongoose.connection;
  datab.on('connected', () => {
    console.log('connected to mongo server');
  });
  datab.on('error', (err) => {
    console.log('connection error', err.message);
  });
  datab.on('disconnected', () => {
    console.log('mongo disconnected');
  });

  module.exports = datab;
}

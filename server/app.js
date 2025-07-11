const app = require('./apptest');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server đang chạy trên port', PORT);
});

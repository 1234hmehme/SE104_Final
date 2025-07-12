const BASE_URL = 'http://localhost:3000/api/baocao';

const baocaoApi = {
  getAll: async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách');
    return res.json();
  },
  getByThang: async (thang: number, nam: number) => {
    const res = await fetch(`${BASE_URL}/getByThang/${thang}/${nam}`);
    if (!res.ok) throw new Error('Lỗi khi lấy báo cáo tháng');
    return res.json();
  },
};

export default baocaoApi;

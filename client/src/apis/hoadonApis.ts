const BASE_URL = 'http://localhost:3000/api/hoadon';

const hoadonApi = {
  getAll: async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách');
    return res.json();
  },
  getDetailById: async (id: string) => {
    const res = await fetch(`${BASE_URL}/getDetailById/${id}`);
    if (!res.ok) throw new Error('Lỗi khi lấy chi tiết hóa đơn');
    return res.json();
  },
};

export default hoadonApi;

const BASE_URL = 'http://localhost:3000/api/tieccuoi';

const tieccuoiApi = {
  getAll: async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách');
    return res.json();
  },

  create: async (data: any) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Lỗi khi tạo tiệc cưới');
    return res.json();
  },

  update: async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Lỗi khi cập nhật');
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Lỗi khi xoá');
    return res.json();
  },

  pay: async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}/pay`, { method: 'POST' });
    if (!res.ok) throw new Error('Lỗi khi thanh toán');
    return res.json();
  },

  cancel: async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}/cancel`, { method: 'POST' });
    if (!res.ok) throw new Error('Lỗi khi huỷ');
    return res.json();
  },
};

export default tieccuoiApi;

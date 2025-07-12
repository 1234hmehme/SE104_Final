const BASE_URL = 'http://localhost:3000/api/dichvu';

const dichvuApi = {
  getAll: async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách');
    return res.json();
  },

  create: async (formData: any) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Lỗi khi tạo dịch vụ');
    return res.json();
  },

  update: async (id: string, formData: any) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) throw new Error('Lỗi khi cập nhật');
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Lỗi khi xoá');
    return res.json();
  },
};

export default dichvuApi;

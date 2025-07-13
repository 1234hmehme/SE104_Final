import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/taikhoan'; 

export const getAllApprovedAccounts = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.filter((acc: any) => acc.LoaiTK === 'NhanVien' && acc.DaDuyet);
};

export const getUnapprovedAccounts = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.filter((acc: any) => acc.LoaiTK === 'NhanVien' && !acc.DaDuyet);
};

export const approveAccount = async (id: string) => {
  return await axios.put(`${BASE_URL}/duyet/${id}`);
};
export const deleteAccount = async (id: string) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};


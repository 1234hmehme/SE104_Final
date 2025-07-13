import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, DialogActions } from '@mui/material';
import dichvuApi from '../../apis/dichvuApis';
import ImageUploader from '../../components/ImageUploader';

interface ServiceAddDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onFail: (message: string) => void;
    categories: string[];
}

const ServiceAddDialog: React.FC<ServiceAddDialogProps> = ({ open, onClose, onSuccess, onFail, categories }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null as File | null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e: any) => {
        setForm({ ...form, category: e.target.value });
    };

    const handleSave = async () => {
        if (!form.image) {
            alert("Vui lòng chọn ảnh!");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("TENDICHVU", form.name);
        formData.append("DONGIA", form.price);
        formData.append("GHICHU", form.description || "");
        formData.append("DANHMUC", form.category);
        formData.append("HINHANH", form.image); // 👈 gửi ảnh lên cùng dữ liệu

        try {
            await dichvuApi.create(formData);
            onSuccess("Thêm dịch vụ thành công");

            setForm({ name: '', description: '', price: '', category: '', image: null });
            onClose();
        } catch (err) {
            onFail("Thêm dịch vụ thất bại");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            sx={{
                '& .MuiPaper-root': {
                    padding: '26px 4px',
                    borderRadius: '15px',
                    maxWidth: '700px',
                },
                '& .MuiDialogContent-root': {
                    padding: 0,
                },
                "& fieldset": {
                    borderRadius: "10px",
                },
                "& .MuiInputBase-input": {
                    padding: "15px 10px",
                    fontSize: "16px",
                    "&::placeholder": {
                        color: "#a5bed4",
                        opacity: 1,
                    },
                },
            }}
        >
            <DialogTitle sx={{
                padding: '8px 24px',
                paddingTop: '0px',
                fontWeight: 'bold',
                textAlign: 'center',
            }}>Thêm dịch vụ mới</DialogTitle>

            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '20px',
                    padding: '15px 24px'
                }}>
                    <TextField label="Tên dịch vụ" name="name" variant="outlined" fullWidth value={form.name} onChange={handleChange} />
                    <TextField label="Mô tả" name="description" variant="outlined" fullWidth value={form.description} onChange={handleChange} />
                    <TextField label="Giá" name="price" variant="outlined" type="number" fullWidth value={form.price}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0) {
                                handleChange(e)
                            }
                        }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Danh mục</InputLabel>
                        <Select label="Danh mục" value={form.category} onChange={handleCategoryChange}>
                            {categories.filter(cat => cat !== 'Tất cả').map(category => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <ImageUploader
                        onImageSelect={(file) => {
                            console.log("Ảnh được chọn:", file);
                            setForm({ ...form, image: file });
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{
                alignSelf: 'center',
                paddingTop: '16px',
                paddingBottom: '0px',
                gap: '20px',
            }}>
                <Button onClick={onClose}
                    sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        borderRadius: '8px',
                        textTransform: "none",
                    }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave} disabled={loading || !form.name || Number(form.price) == 0 || !form.category || !form.image}
                    sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        borderRadius: '8px',
                        textTransform: "none",
                        backgroundColor: '#4880FF'
                    }}
                >
                    {loading ? "Đang lưu..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ServiceAddDialog; 
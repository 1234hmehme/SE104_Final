import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, DialogActions } from '@mui/material';
import { IFood } from '../../interfaces/food.interface';
import monanApi from '../../apis/monanApis';
import ImageUploader from '../../components/ImageUploader';
import { defaultBgColorMap, defaultTextColorMap } from '../../assets/color/ColorMap';

interface FoodEditDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onFail: (message: string) => void;
    food: IFood | null;
    categories: string[];
}

const FoodEditDialog: React.FC<FoodEditDialogProps> = ({ open, onClose, food, categories, onSuccess, onFail, }) => {
    const [form, setForm] = useState<IFood | null>(food);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm(food);
    }, [food]);

    if (!form) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e: any) => {
        setForm({ ...form, category: e.target.value });
    };

    const handleSave = async () => {
        if (!food) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("TENMONAN", form.name);
        formData.append("GHICHU", form.description || "");
        formData.append("DONGIA", form.price.toString());
        formData.append("LOAI", form.category);
        if (file) {
            formData.append("HINHANH", file);
        }

        try {
            await monanApi.update(food._id, formData);
            onSuccess("Cập nhật món ăn thành công");
            onClose();
        } catch (err) {
            console.error("Lỗi khi sửa:", err);
            onFail("Cập nhật món ăn thất bại");
        } finally {
            setLoading(false);
            //setIsSaveInfoConfirmOpen(false);
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
            }}>Sửa món ăn</DialogTitle>

            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '20px',
                    padding: '15px 24px'
                }}>
                    <TextField label="Tên món" name="name" variant="outlined" fullWidth value={form.name} onChange={handleChange} />
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
                        <InputLabel>Loại món</InputLabel>
                        <Select label="Loại món" value={form.category} onChange={handleCategoryChange}>
                            {categories.filter(c => c !== 'Tất cả').map((category) => (
                                <MenuItem key={category} value={category}>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        paddingX: 1.5,
                                        paddingY: 0.5,
                                        borderRadius: 2,
                                        backgroundColor: defaultBgColorMap[category],
                                        color: defaultTextColorMap[category],
                                        fontWeight: 'bold',
                                        zIndex: 100
                                    }}>
                                        {category}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <ImageUploader
                        initialImage={food?.image}
                        onImageSelect={(file) => {
                            console.log("Ảnh được chọn:", file);
                            setFile(file);
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

export default FoodEditDialog;
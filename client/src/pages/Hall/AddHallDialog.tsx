import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';
import ImageUploader from '../../components/ImageUploader';
import sanhApi from '../../apis/sanhApis';
// Nếu cần dùng IHallInfo hoặc hallInfo thì import từ './hallInfo.mock';

interface AddHallDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onFail: (message: string) => void;
    hallTypes: string[];
}

const AddHallDialog: React.FC<AddHallDialogProps> = ({ open, onClose, onSuccess, onFail, hallTypes }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [maxTables, setMaxTables] = useState("");
    const [price, setPrice] = useState("");
    const [note, setNote] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!file) {
            alert("Vui lòng chọn ảnh!");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("TENSANH", name);
        formData.append("LOAISANH", type);
        formData.append("SOLUONGBANTD", maxTables);
        formData.append("DONGIABANTT", price);
        formData.append("GHICHU", note);
        formData.append("HINHANH", file); // 👈 gửi ảnh lên cùng dữ liệu

        try {
            await sanhApi.create(formData);
            onSuccess("Thêm sảnh thành công");

            setName(""); setType(""); setMaxTables(""); setPrice(""); setNote("");
            onClose();
        } catch (err) {
            onFail("Thêm sảnh thất bại");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            BackdropProps={{
                style: { backdropFilter: 'blur(5px)' }
            }}
        >
            <DialogTitle>Thêm sảnh mới</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Tên Sảnh" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)} />
                <FormControl fullWidth>
                    <InputLabel>Loại Sảnh</InputLabel>
                    <Select label="Loại Sảnh" value={type} onChange={e => setType(e.target.value)}>
                        {hallTypes.map((t) => (
                            <MenuItem key={t} value={t}>{`Loại ${t}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField label="Số Lượng Bàn Tối Đa" variant="outlined" type="number" fullWidth value={maxTables} onChange={e => setMaxTables(e.target.value)} />
                <TextField label="Đơn giá" variant="outlined" fullWidth value={price} onChange={e => setPrice(e.target.value)} />
                <TextField label="Ghi Chú" variant="outlined" multiline rows={3} fullWidth value={note} onChange={e => setNote(e.target.value)} />
                <ImageUploader
                    onImageSelect={(file) => {
                        console.log("Ảnh được chọn:", file);
                        setFile(file)
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button onClick={onClose} color="secondary" disabled={loading}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleSave} disabled={loading || !name || !type || !maxTables || !price || !note}>
                        {loading ? "Đang lưu..." : "Lưu"}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AddHallDialog;
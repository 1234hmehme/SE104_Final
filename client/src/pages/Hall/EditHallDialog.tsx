import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';
import sanhApi from '../../apis/sanhApis';
import ImageUploader from '../../components/ImageUploader';

interface IHallInfo {
    _id: string,
    TENSANH: string;
    LOAISANH: string;
    SOLUONGBANTD: number;
    DONGIABANTT: number;
    GHICHU: string;
    HINHANH: string;
}

interface EditHallDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onFail: (message: string) => void;
    hall: IHallInfo | null;
    hallTypes: string[];
}

const EditHallDialog: React.FC<EditHallDialogProps> = ({ open, onClose, hall, hallTypes, onSuccess, onFail, }) => {
    const [name, setName] = useState(hall?.TENSANH || "");
    const [type, setType] = useState(hall?.LOAISANH || "");
    const [maxTables, setMaxTables] = useState(hall?.SOLUONGBANTD?.toString() || "");
    const [price, setPrice] = useState(hall?.DONGIABANTT?.toString() || "");
    const [note, setNote] = useState(hall?.GHICHU || "");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(hall?.TENSANH || "");
        setType(hall?.LOAISANH || "");
        setMaxTables(hall?.SOLUONGBANTD?.toString() || "");
        setPrice(hall?.DONGIABANTT?.toString() || "");
        setNote(hall?.GHICHU || "");
    }, [hall]);

    const handleSave = async () => {
        if (!hall) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("TENSANH", name);
        formData.append("LOAISANH", type);
        formData.append("SOLUONGBANTD", maxTables);
        formData.append("DONGIABANTT", price);
        formData.append("GHICHU", note);
        if (file) {
            formData.append("HINHANH", file);
        }

        try {
            await sanhApi.update(hall._id, formData);
            onSuccess("Cập nhật sảnh thành công");
            onClose();
        } catch (err) {
            console.error("Lỗi khi sửa:", err);
            onFail("Cập nhật sảnh thất bại");
        } finally {
            setLoading(false);
            //setIsSaveInfoConfirmOpen(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Sửa thông tin sảnh</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Tên Sảnh"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel>Loại Sảnh</InputLabel>
                    <Select
                        label="Loại Sảnh"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        {hallTypes.map((t) => (
                            <MenuItem key={t} value={t}>{`Loại ${t}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Số Lượng Bàn Tối Đa"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={maxTables}
                    onChange={e => setMaxTables(e.target.value)}
                />
                <TextField
                    label="Đơn Giá Bàn Tối Thiểu"
                    variant="outlined"
                    type="number"
                    fullWidth
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                <TextField
                    label="Ghi Chú"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
                <ImageUploader
                    initialImage={hall?.HINHANH}
                    onImageSelect={(file) => setFile(file)}
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

export default EditHallDialog;
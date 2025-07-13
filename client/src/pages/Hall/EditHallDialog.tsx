import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, DialogActions } from '@mui/material';
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
            }}>Sửa thông tin sảnh</DialogTitle>
            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '20px',
                    padding: '15px 24px'
                }}>
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
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0) {
                                setMaxTables(e.target.value);
                            }
                        }}
                    />
                    <TextField
                        label="Đơn Giá Bàn Tối Thiểu"
                        variant="outlined"
                        type="number"
                        fullWidth
                        value={price}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0) {
                                setPrice(e.target.value);
                            }
                        }}
                    />
                    <TextField
                        label="Ghi Chú"
                        variant="outlined"
                        fullWidth
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                    <ImageUploader
                        initialImage={hall?.HINHANH}
                        onImageSelect={(file) => setFile(file)}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{
                alignSelf: 'center',
                paddingTop: '16px',
                paddingBottom: '0px',
                gap: '20px',
            }}>
                <Button onClick={onClose} disabled={loading}
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
                    onClick={handleSave} disabled={loading || !name || !type || Number(maxTables) == 0 || Number(price) == 0 || !note}
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

export default EditHallDialog;
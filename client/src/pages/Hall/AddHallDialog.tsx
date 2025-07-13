import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, DialogActions } from '@mui/material';
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
            onClose={() => {
                setFile(null)
                onClose()
            }}
            maxWidth="sm"
            fullWidth
            BackdropProps={{
                style: { backdropFilter: 'blur(5px)' }
            }}
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
            }}>Thêm sảnh mới</DialogTitle>
            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '20px',
                    padding: '15px 24px'
                }}>
                    <TextField label="Tên Sảnh" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)} />
                    <FormControl fullWidth>
                        <InputLabel>Loại Sảnh</InputLabel>
                        <Select label="Loại Sảnh" value={type} onChange={e => setType(e.target.value)}>
                            {hallTypes.map((t) => (
                                <MenuItem key={t} value={t}>{`Loại ${t}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField label="Số Lượng Bàn Tối Đa" variant="outlined"
                        type="number" fullWidth value={maxTables}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0) {
                                setMaxTables(e.target.value);
                            }
                        }}
                    />
                    <TextField label="Đơn Giá Bàn Tối Thiểu" variant="outlined"
                        type="number" fullWidth value={price}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0) {
                                setPrice(e.target.value);
                            }
                        }}
                    />
                    <TextField label="Ghi Chú" variant="outlined" fullWidth value={note} onChange={e => setNote(e.target.value)} />
                    <ImageUploader
                        onImageSelect={(file) => {
                            console.log("Ảnh được chọn:", file);
                            setFile(file)
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
                <Button onClick={() => {
                    setFile(null)
                    onClose()
                }} disabled={loading}
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
                    onClick={handleSave} disabled={loading || !name || !type || Number(maxTables) == 0 || Number(price) == 0 || !note || !file}
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

export default AddHallDialog;
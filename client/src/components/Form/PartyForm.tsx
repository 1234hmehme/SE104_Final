import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Box,
    Typography,
    FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";
import { formatDate } from "../../utils/formatDate";
import { defaultBgColorMap, defaultTextColorMap } from "../../assets/color/ColorMap";

export default function PartyForm({
    open,
    onClose,
    onUpdate,
    onPay,
    onCancel,
    initialData,
    readOnly,
}: {
    open: boolean;
    onClose: () => void;
    onUpdate: (data: any) => void;
    onPay: () => void;
    onCancel: (partyId: any) => void;
    initialData?: any;
    readOnly: boolean;
}) {
    const [form, setForm] = useState({
        id: "",
        groom: "",
        bride: "",
        phone: "",
        date: "",
        shift: "",
        hall: "",
        hallType: "A",
        deposit: 0,
        tables: 0,
        reserveTables: 0,
        status: "Đã đặt cọc",
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            id: "",
            groom: "",
            bride: "",
            phone: "",
            date: "",
            shift: "",
            hall: "",
            hallType: "A",
            deposit: 0,
            tables: 0,
            reserveTables: 0,
            status: "Đã đặt cọc",
        });
    }, [initialData]);

    const now = new Date();
    const eventDate = new Date(form.date);
    const oneDayMs = 1000 * 60 * 60 * 24;

    // Số ngày trễ (làm tròn lên)
    const daysLate = Math.max(0, Math.ceil((now.getTime() - eventDate.getTime()) / oneDayMs));
    // Tiền phạt = 1% mỗi ngày trễ trên tổng tiền
    const penalty = (daysLate - 1) * 0.01 * form.deposit * 10;

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
            }}>
                {readOnly ?
                    "Thông tin tiệc"
                    : initialData && "Cập nhật thông tin tiệc"
                }
            </DialogTitle>

            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '20px',
                    padding: '15px 24px'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Tên chú rể
                        </Typography>
                        <TextField fullWidth value={form.groom}
                            placeholder="Nhập tên chú rể"
                            disabled={readOnly}
                            onChange={(e) => setForm({ ...form, groom: e.target.value })} />
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Tên cô dâu
                        </Typography>
                        <TextField fullWidth value={form.bride}
                            placeholder="Nhập tên tô dâu"
                            disabled={readOnly}
                            onChange={(e) => setForm({ ...form, bride: e.target.value })} />
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Số điện thoại
                        </Typography>
                        <TextField fullWidth value={form.phone}
                            placeholder="Nhập số điện thoại"
                            disabled={readOnly}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: ({ xs: 'column', sm: 'row', }),
                        gap: '18px',
                    }}>
                        <FormControl fullWidth sx={{
                            flexDirection: 'column',
                        }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Ngày tổ chức
                            </Typography>
                            <TextField
                                fullWidth
                                value={formatDate(form.date)}
                                disabled={true} />
                        </FormControl>

                        <FormControl fullWidth sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Ca
                            </Typography>
                            <TextField
                                fullWidth
                                value={form.shift}
                                disabled={true} />
                        </FormControl>

                        <FormControl fullWidth sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Sảnh
                            </Typography>
                            <TextField
                                fullWidth
                                value={form.hall}
                                disabled={true} />
                        </FormControl>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Tiền cọc
                        </Typography>
                        <TextField fullWidth value={form.deposit}
                            placeholder="Nhập tiền cọc"
                            disabled={true}
                            onChange={(e) => setForm({ ...form, deposit: Number(e.target.value) })} />
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Số lượng bàn
                        </Typography>
                        <TextField fullWidth value={form.tables}
                            placeholder="Nhập số lượng bàn"
                            disabled={true}
                            onChange={(e) => setForm({ ...form, tables: Number(e.target.value) })} />
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Số bàn dự trữ
                        </Typography>
                        <TextField fullWidth value={form.reserveTables}
                            placeholder="Nhập số bàn dự trữ"
                            disabled={true}
                            onChange={(e) => setForm({ ...form, reserveTables: Number(e.target.value) })} />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Trạng thái
                        </Typography>

                        <Box sx={{
                            width: 'fit-content',
                            padding: '5px 30px',
                            marginTop: '10px',
                            fontSize: "14px",
                            fontWeight: "bold",
                            borderRadius: '8px',
                            backgroundColor: defaultBgColorMap[form.status],
                            color: defaultTextColorMap[form.status],
                            textTransform: "none",
                        }}>
                            {form.status}
                        </Box>
                    </Box>

                    {form.status == 'Đã đặt cọc' &&
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'red' }}>
                                Tổng tiền còn lại: {(form.deposit * 9).toLocaleString()} VND
                            </Typography>
                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'red' }}>
                                Ngày đến hạn thanh toán: {formatDate(form.date)}
                            </Typography>
                            {new Date(form.date) < new Date() &&
                                <Box>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'red' }}>
                                        Đã trễ hạn: {daysLate} ngày
                                    </Typography>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'red' }}>
                                        Tiền phạt: {penalty.toLocaleString()} VND ({daysLate}%)
                                    </Typography>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'red' }}>
                                        Tổng cần thanh toán: {(form.deposit * 9 + penalty).toLocaleString()} VND
                                    </Typography>
                                </Box>
                            }
                        </Box>
                    }
                </Box>
            </DialogContent>

            {!readOnly &&
                <DialogActions sx={{
                    alignSelf: 'center',
                    paddingTop: '16px',
                    paddingBottom: '0px',
                    gap: '20px',
                }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            console.log("DỮ LIỆU GỬI LÊN:", form); // ✅ thêm dòng này
                            onUpdate(form);
                        }}
                        sx={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            borderRadius: '8px',
                            backgroundColor: defaultBgColorMap['Đã đặt cọc'],
                            color: defaultTextColorMap['Đã đặt cọc'],
                            textTransform: "none",
                        }}
                    >
                        Lưu thông tin
                    </Button>
                    {form.status === 'Đã đặt cọc' &&
                        <>
                            <Button
                                variant="contained"
                                onClick={() => onPay()}
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    borderRadius: '8px',
                                    backgroundColor: defaultBgColorMap['Đã thanh toán'],
                                    color: defaultTextColorMap['Đã thanh toán'],
                                    textTransform: "none",
                                }}
                            >
                                Thanh toán
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => onCancel(form.id)}
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    borderRadius: '8px',
                                    backgroundColor: defaultBgColorMap['Đã huỷ'],
                                    color: defaultTextColorMap['Đã huỷ'],
                                    textTransform: "none",
                                }}
                            >
                                Hủy tiệc
                            </Button>
                        </>
                    }
                </DialogActions>
            }
        </Dialog>
    );
}

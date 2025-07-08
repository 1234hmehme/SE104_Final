import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Box,
    Select,
    MenuItem,
    Typography,
    FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";
import { formatDate } from "../../utils/formatDate";
import { defaultBgColorMap, defaultTextColorMap } from "../../assets/color/ColorMap";

export default function PartyForm({
    open,
    onClose,
    onSubmit,
    onExportBill,
    initialData,
    readOnly,
    hallName,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    onExportBill: (partyData: any) => void;
    initialData?: any;
    readOnly: boolean;
    hallName: string;
}) {
    const [form, setForm] = useState({
        id: 0,
        groom: "",
        bride: "",
        phone: "",
        date: "",
        shift: "",
        hall: "",
        deposit: 0,
        tables: 0,
        reserveTables: 0,
        status: "Đã đặt cọc",
    });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({
            id: 0,
            groom: "",
            bride: "",
            phone: "",
            date: "",
            shift: "",
            hall: "",
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
    const penalty = daysLate * 0.01 * form.deposit * 10;

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
                                value={hallName}
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

                        <Box sx={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                            {!readOnly && initialData?.status == 'Đã đặt cọc' ?
                                ['Đã đặt cọc', 'Đã thanh toán', 'Đã huỷ'].map((status) =>
                                    <Box
                                        onClick={() => {
                                            setForm({ ...form, status: status })
                                        }}
                                        sx={[{
                                            width: 'fit-content',
                                            padding: '5px 30px',
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            borderRadius: '8px',
                                            borderColor: defaultTextColorMap[status],
                                            color: defaultTextColorMap[status],
                                            textTransform: "none",
                                            cursor: 'pointer',
                                        }, form.status == status ? {
                                            backgroundColor: defaultBgColorMap[status],
                                        } : {
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                        }]}
                                    >
                                        {status}
                                    </Box>
                                )
                                :
                                <Box sx={{
                                    width: 'fit-content',
                                    padding: '5px 30px',
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    borderRadius: '8px',
                                    backgroundColor: defaultBgColorMap[form.status],
                                    color: defaultTextColorMap[form.status],
                                    textTransform: "none",
                                }}>
                                    {form.status}
                                </Box>

                            }
                        </Box>
                    </Box>

                    {form.status == 'Đã đặt cọc' &&
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'red' }}>
                                Tổng tiền còn lại: {(form.deposit * 10).toLocaleString()} VND
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
                                        Tổng cần thanh toán: {(form.deposit * 10 + penalty).toLocaleString()} VND
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
                    gap: '10px',
                }}>
                    <Button onClick={onClose}
                        sx={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: 'var(--text-color)',
                            textTransform: "none",
                        }}
                    >
                        Huỷ
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            console.log("DỮ LIỆU GỬI LÊN:", form); // ✅ thêm dòng này

                            onSubmit(form);
                        }}
                        sx={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            borderRadius: '8px',
                            backgroundColor: "#4caf50",
                            textTransform: "none",
                        }}
                    >
                        Lưu
                    </Button>
                </DialogActions>
            }
        </Dialog>
    );
}

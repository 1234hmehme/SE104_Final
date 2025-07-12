import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { useState, useEffect } from "react";
import { defaultBgColorMap, defaultTextColorMap } from "../../assets/color/ColorMap";
import { formatDate } from "../../utils/formatDate";
import hoadonApi from "../../apis/hoadonApis";
import { IBillDetail } from "../../interfaces/bill.interface";

export default function BillForm({
    open,
    onClose,
    billId,
}: {
    open: boolean;
    onClose: () => void;
    billId: string;
}) {
    const [form, setForm] = useState<IBillDetail>({
        id: '',
        NGAYTHANHTOAN: '',
        SOTIENHOADON: 0,
        TIENPHAT: 0,
        TIENBAN: 0,
        TIENDICHVU: 0,
        LOAIHOADON: "Đặt cọc",
        NGAYDAI: '',

        CHURE: '',
        CODAU: '',
        SOLUONGBAN: 0,
        SOBANDT: 0,

        monAn: [],

        dichVu: [],
    });

    const fetchBillDetail = async () => {
        try {
            const data = await hoadonApi.getDetailById(billId);

            const mapped = {
                id: data.hoadon._id,
                NGAYTHANHTOAN: data.hoadon.NGAYTHANHTOAN,
                SOTIENHOADON: data.hoadon.SOTIENHOADON,
                TIENPHAT: data.hoadon.TIENPHAT,
                TIENBAN: data.hoadon.TIENBAN,
                TIENDICHVU: data.hoadon.TIENDICHVU,
                LOAIHOADON: data.hoadon.LOAIHOADON,

                CHURE: data.tiec.TENCR,
                CODAU: data.tiec.TENCD,
                SOLUONGBAN: data.tiec.SOLUONGBAN,
                SOBANDT: data.tiec.SOBANDT,
                NGAYDAI: data.tiec.NGAYDAI,

                monAn: data.monAn,

                dichVu: data.dichVu,
            };

            setForm(mapped);
        } catch (err) {
            console.error("Lỗi khi fetch bill:", err);
        }
    }
    useEffect(() => {
        fetchBillDetail()
    }, [billId]);

    const totalTables = (form.SOLUONGBAN || 0) + (form.SOBANDT || 0);
    const daysLate = (form.TIENPHAT || 0) / (form.TIENBAN + form.TIENDICHVU) / 0.01;
    const tongTienTiecCuoi = (form.TIENBAN || 0) + (form.TIENDICHVU || 0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            sx={{
                '& .MuiPaper-root': {
                    padding: '26px 4px',
                    borderRadius: '15px',
                    maxWidth: '850px',
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
                Hóa đơn
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '20px 10px',
                        "& fieldset": {
                            borderRadius: "10px",
                        },
                        "& .MuiPaper-root": {
                            padding: "10px 4px",
                            borderRadius: '10px',
                        },
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '90%',
                    }}>
                        <Box sx={{ display: 'flex', gap: '10px', width: '30%' }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Tên chú rể:</Typography>
                            <Typography sx={{ fontSize: '16px' }}>{form.CHURE}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '10px', width: '30%' }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Tên cô dâu:</Typography>
                            <Typography sx={{ fontSize: '16px' }}>{form.CODAU}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '10px', width: '30%' }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Ngày đãi tiệc:</Typography>
                            <Typography sx={{ fontSize: '16px' }}>{formatDate(form.NGAYDAI)}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '90%',
                        alignItems: 'center',
                    }}>
                        <Box sx={{ display: 'flex', gap: '10px', width: '30%' }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Tổng tiền đặt tiệc:</Typography>
                            <Typography sx={{ fontSize: '16px' }}>{tongTienTiecCuoi.toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '10px', width: '30%', alignItems: 'center', }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                                Loại hóa đơn:
                            </Typography>

                            <Box sx={{
                                width: 'fit-content',
                                padding: '5px 15px',
                                fontSize: "14px",
                                fontWeight: "bold",
                                borderRadius: '8px',
                                backgroundColor: defaultBgColorMap[form.LOAIHOADON],
                                color: defaultTextColorMap[form.LOAIHOADON],
                                textTransform: "none",
                            }}>
                                {form.LOAIHOADON}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '10px', width: '30%' }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Ngày thanh toán:</Typography>
                            <Typography sx={{ fontSize: '16px' }}>{formatDate(form.NGAYTHANHTOAN)}</Typography>
                        </Box>
                    </Box>

                    {form.LOAIHOADON == 'Thanh toán' ?
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '90%', }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: 'red' }}>
                                Còn lại: {(tongTienTiecCuoi / 10 * 9).toLocaleString()} VND
                            </Typography>
                            {form.TIENPHAT > 0 &&
                                <Box>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: 'red' }}>
                                        Thanh toán trễ: {daysLate} ngày
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: 'red' }}>
                                        Tiền phạt: {form.TIENPHAT.toLocaleString()} VND ({daysLate}%)
                                    </Typography>
                                </Box>
                            }
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: 'red' }}>
                                Tổng thanh toán: {(form.SOTIENHOADON).toLocaleString()} VND
                            </Typography>
                        </Box>
                        :
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '90%', }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: 'red' }}>
                                Tiền đặt cọc: {(tongTienTiecCuoi / 10).toLocaleString()} VND
                            </Typography>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: 'red' }}>
                                Còn lại: {(tongTienTiecCuoi / 10 * 9).toLocaleString()} VND
                            </Typography>
                        </Box>
                    }

                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold', width: '80%' }}>
                        Món ăn:
                    </Typography>

                    <TableContainer component={Paper} sx={{
                        width: '90%',
                        borderRadius: 3,
                        boxShadow: 3,
                    }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>STT</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Tên món ăn</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Danh mục</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Đơn giá</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Ghi Chú</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {form.monAn.map((item, index) =>
                                    <TableRow key={item._id}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell>{item.TENMONAN}</TableCell>
                                        <TableCell align="center">{item.LOAI}</TableCell>
                                        <TableCell align="center">{item.GIATIEN.toLocaleString('vi-VN')}</TableCell>
                                        <TableCell>{item.GHICHU}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                                        Số lượng bàn: {totalTables}
                                    </TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                                        Đơn giá bàn: {(form.TIENBAN / (totalTables)).toLocaleString('vi-VN')}
                                    </TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                                        Tổng tiền bàn: {form.TIENBAN.toLocaleString('vi-VN')}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold', width: '80%' }}>
                        Dịch vụ:
                    </Typography>

                    <TableContainer component={Paper} sx={{
                        width: '90%',
                        borderRadius: 3,
                        boxShadow: 3,
                    }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>STT</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Tên dịch vụ</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Đơn giá</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Thành tiền</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {form.dichVu.map((item, index) =>
                                    <TableRow key={item._id}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell>{item.TENDICHVU}</TableCell>
                                        <TableCell align="center">{item.SOLUONG}</TableCell>
                                        <TableCell align="center">{item.GIATIEN.toLocaleString('vi-VN')}</TableCell>
                                        <TableCell align="center">{(item.SOLUONG * item.GIATIEN).toLocaleString('vi-VN')}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                                        Tổng tiền dịch vụ: {form.TIENDICHVU.toLocaleString('vi-VN')}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
            </DialogContent>
        </Dialog >
    );
}

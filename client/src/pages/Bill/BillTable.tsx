import { useState } from "react";
import {
    IconButton,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
} from "@mui/material";
import { IBill } from "../../interfaces/bill.interface";
import { defaultBgColorMap, defaultTextColorMap } from "../../assets/color/ColorMap";
import dayjs from "dayjs";
import { Eye } from "lucide-react";

type BillKey = keyof IBill;

export default function BillTable({
    data,
    searchKey,
    handleRead,
}: {
    data: IBill[],
    searchKey: string,
    handleRead: (party: any) => void,
}) {
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<BillKey>('id');

    const handleRequestSort = (property: BillKey) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedBill = [...data].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (typeof aValue === "number" && typeof bValue === "number") {
            return order === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
            return order === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return 0;
    });
    
    return (
        <TableContainer>
            <Table stickyHeader>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: '#b8d8ff',
                            '& th': {
                                backgroundColor: '#b8d8ff' // Áp dụng cho các ô
                            },
                            '&:last-child td, &:last-child th': {
                                border: 'none'
                            }
                        }}
                    >
                        <TableCell align="center"><b>Stt</b></TableCell>

                        <TableCell align="center" onClick={() => handleRequestSort('groom')}>
                            <TableSortLabel
                                active={orderBy === 'groom'}
                                direction={orderBy === 'groom' ? order : 'asc'}
                                sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    '& .MuiTableSortLabel-icon': {
                                        margin: 0,
                                        position: 'absolute',
                                        right: '-20px',
                                    }
                                }}
                            >
                                <b>Chú rể</b>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell align="center" onClick={() => handleRequestSort('bride')}>
                            <TableSortLabel
                                active={orderBy === 'bride'}
                                direction={orderBy === 'bride' ? order : 'asc'}
                                sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    '& .MuiTableSortLabel-icon': {
                                        margin: 0,
                                        position: 'absolute',
                                        right: '-20px',
                                    }
                                }}
                            >
                                <b>Cô dâu</b>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell align="center" onClick={() => handleRequestSort('tableTotalPrice')}>
                            <TableSortLabel
                                active={orderBy === 'tableTotalPrice'}
                                direction={orderBy === 'tableTotalPrice' ? order : 'asc'}
                                sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    '& .MuiTableSortLabel-icon': {
                                        margin: 0,
                                        position: 'absolute',
                                        right: '-20px',
                                    }
                                }}
                            >
                                <b>Tổng tiền bàn</b>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell align="center" onClick={() => handleRequestSort('serviceTotalPrice')}>
                            <TableSortLabel
                                active={orderBy === 'serviceTotalPrice'}
                                direction={orderBy === 'serviceTotalPrice' ? order : 'asc'}
                                sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    '& .MuiTableSortLabel-icon': {
                                        margin: 0,
                                        position: 'absolute',
                                        right: '-20px',
                                    }
                                }}
                            >
                                <b>Tổng tiền dịch vụ</b>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell align="center" onClick={() => handleRequestSort('date')}>
                            <TableSortLabel
                                active={orderBy === 'date'}
                                direction={orderBy === 'date' ? order : 'asc'}
                                sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    '& .MuiTableSortLabel-icon': {
                                        margin: 0,
                                        position: 'absolute',
                                        right: '-20px',
                                    }
                                }}
                            >
                                <b>Ngày thanh toán</b>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell align="center" onClick={() => handleRequestSort('paymentAmount')}>
                            <TableSortLabel
                                active={orderBy === 'paymentAmount'}
                                direction={orderBy === 'paymentAmount' ? order : 'asc'}
                                sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    '& .MuiTableSortLabel-icon': {
                                        margin: 0,
                                        position: 'absolute',
                                        right: '-20px',
                                    }
                                }}
                            >
                                <b>Số tiền</b>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell align="center" onClick={() => handleRequestSort('penalty')}>
                            <TableSortLabel
                                active={orderBy === 'penalty'}
                                direction={orderBy === 'penalty' ? order : 'asc'}
                                sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    '& .MuiTableSortLabel-icon': {
                                        margin: 0,
                                        position: 'absolute',
                                        right: '-20px',
                                    }
                                }}
                            >
                                <b>Tiền phạt</b>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell align="center" onClick={() => handleRequestSort('type')}>
                            <TableSortLabel
                                active={orderBy === 'type'}
                                direction={orderBy === 'type' ? order : 'asc'}
                                sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    '& .MuiTableSortLabel-icon': {
                                        margin: 0,
                                        position: 'absolute',
                                        right: '-20px',
                                    }
                                }}
                            >
                                <b>Loại hóa đơn</b>
                            </TableSortLabel>
                        </TableCell>

                        <TableCell align="center"><b>Hành động</b></TableCell>

                    </TableRow>
                </TableHead>
                
                <TableBody>
                    {sortedBill.map((bill, index) => {
                        return (
                            <TableRow key={index} hover>
                                {/* STT */}
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "4%",
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {index + 1}
                                </TableCell>

                                {/* Groom */}
                                <TableCell
                                    sx={{
                                        maxWidth: { xs: 120, md: 150, },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    title={bill.groom}
                                >
                                    {bill.groom}
                                </TableCell>

                                {/* Bride */}
                                <TableCell
                                    sx={{
                                        maxWidth: { xs: 120, md: 150, },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    title={bill.bride}
                                >
                                    {bill.bride}
                                </TableCell>

                                {/* Table Total Price */}
                                <TableCell
                                    align="center"
                                    sx={{ width: "10%", }}
                                >
                                    {bill.tableTotalPrice.toLocaleString()}
                                </TableCell>

                                {/* Service Total Price */}
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "12%",
                                    }}
                                >
                                    {bill.serviceTotalPrice.toLocaleString()}
                                </TableCell>
                                
                                {/* Date */}
                                <TableCell
                                    align="center"
                                    sx={{ width: "12%", }}
                                >
                                    {bill.date ? dayjs(bill.date).format("DD/MM/YYYY") : ""}
                                </TableCell>


                                {/* Payment Amount */}
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "10%",
                                    }}
                                >
                                    {bill.paymentAmount.toLocaleString()}
                                </TableCell>

                                {/* Penalty */}
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "7%",
                                    }}
                                >
                                    {bill.penalty.toLocaleString()}
                                </TableCell>

                                {/* Type */}
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "10%",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            paddingX: 1.5,
                                            paddingY: 0.5,
                                            borderRadius: 2,
                                            fontWeight: 'bold',
                                            backgroundColor: defaultBgColorMap[bill.type],
                                            color: defaultTextColorMap[bill.type],
                                        }}
                                    >
                                        {bill.type}
                                    </Box>
                                </TableCell>

                                {/* Actions */}
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "5%",
                                        padding: 0,
                                    }}
                                >
                                    <IconButton size="small" sx={{ color: '#00b69b' }}
                                        onClick={() => handleRead(bill)}>
                                        <Eye fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {sortedBill.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={10} align="center">
                                Không tìm thấy "{searchKey}".
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer >

    );
}

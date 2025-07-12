import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import BillTable from "./BillTable";
import { IBill } from "../../interfaces/bill.interface";
import BillForm from "../../components/Form/BillForm";
import PartyFilter from "../../components/Filter/PartyFilter";
import SearchBar from "../../components/SearchBar"
import { DatePicker, } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import hoadonApi from "../../apis/hoadonApis";


type PartyKey = "groom" | "bride";

export default function BillPage() {
    const [bills, setBills] = useState<IBill[]>([]);
    const [searchKey, setSearchKey] = useState("");
    const [searchBy, setSearchBy] = useState<PartyKey>("groom");
    const [filterType, setFilterType] = useState("");
    const [fromDate, setFromDate] = useState(dayjs().subtract(1, "month").toISOString());
    const [toDate, setToDate] = useState(dayjs().add(5, 'year').toISOString());

    const [isBillFormOpen, setIsBillFormOpen] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState("");

    const fetchBills = async () => {
        try {
            const data = await hoadonApi.getAll();

            const mapped = data.map((item: any) => ({
                id: item._id,
                groom: item.TENCR,
                bride: item.TENCD,
                tableTotalPrice: item.TIENBAN,
                serviceTotalPrice: item.TIENDICHVU,
                date: item.NGAYTHANHTOAN,
                paymentAmount: item.SOTIENHOADON,
                penalty: item.TIENPHAT,
                type: item.LOAIHOADON,
            }));

            setBills(mapped);
        } catch (err) {
            console.error("Lỗi khi fetch tiệc cưới:", err);
        }
    };

    useEffect(() => {
        fetchBills(); // tải danh sách hóa đơn
    }, []);

    const filteredBills = bills.filter((bill) => {
        const billDate = dayjs(bill.date);
        const from = dayjs(fromDate);
        const to = dayjs(toDate);

        const matchesDate = billDate.isAfter(from.subtract(1, 'day')) && billDate.isBefore(to.add(1, 'day'));
        const matchesType = filterType ? bill.type === filterType : true;

        let matchesSearch = true;
        if (searchKey) {
            const value = bill[searchBy];
            if (typeof value === "number") {
                matchesSearch = value === Number(searchKey);
            } else {
                matchesSearch = value?.toLowerCase().includes(searchKey.toLowerCase());
            }
        }

        return matchesDate && matchesSearch && matchesType;
    });

    const handleRead = (billId: string) => {
        setSelectedBillId(billId);
        setIsBillFormOpen(true);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: "100%",
            overflow: 'hidden',
            backgroundColor: '#fff',
            borderRadius: '15px',
            paddingTop: '15px',
        }}>
            <Typography
                sx={{
                    userSelect: "none",
                    color: "var(--text-color)",
                    fontWeight: "bold",
                    fontSize: "32px",
                    marginX: "20px",
                }}
            >
                Danh sách hóa đơn
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: "20px",
                    marginX: "20px",
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: '10px',
                    width: "80%",
                    alignItems: 'flex-end',
                }}>
                    <Box sx={{ flex: 2 }}>
                        <SearchBar
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                    </Box>

                    <FormControl
                        sx={{
                            flex: 1,
                            "& fieldset": {
                                borderRadius: "10px",
                            },
                            "& .MuiInputBase-input": {
                                paddingY: "10px",
                                paddingLeft: "14px",
                                backgroundColor: '#fff',
                            },
                        }}
                    >
                        <Select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value as PartyKey)}

                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        boxSizing: 'border-box',
                                        padding: "0 8px",
                                        border: "1px solid #e4e4e7",
                                        "& .MuiMenuItem-root": {
                                            borderRadius: "6px",
                                            "&:hover": {
                                                backgroundColor: "rgba(117, 126, 136, 0.08)",
                                            },
                                            "&.Mui-selected": {
                                                backgroundColor: "#bcd7ff",
                                            },
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="groom">
                                Tên chú rể
                            </MenuItem>
                            <MenuItem value="bride">
                                Tên cô dâu
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <PartyFilter
                        label="Chọn loại"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        children={["Đặt cọc", "Thanh toán"]}
                    />


                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{
                            flexDirection: 'column',
                        }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Từ ngày
                            </Typography>
                            <DatePicker
                                value={dayjs(fromDate)}
                                format="DD/MM/YYYY"
                                onChange={(value) => setFromDate(value ? value.toISOString() : dayjs().startOf("year").toISOString())}

                                sx={{
                                    "& .MuiPickersInputBase-root": {
                                        backgroundColor: '#fff',
                                        borderRadius: "10px",
                                        gap: '5px',
                                    },
                                    "& .MuiPickersSectionList-root": {
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '43px',
                                        width: 'fit-content',
                                        paddingY: '0px',
                                    },
                                }}
                                slotProps={{
                                    popper: {
                                        sx: {
                                            '& .MuiPaper-root': {
                                                borderRadius: '20px',
                                            },
                                            '& .MuiDateCalendar-root': {
                                                padding: '18px 20px 0px 20px',
                                                gap: '10px',
                                                maxHeight: '360px',
                                                height: 'auto',
                                                width: '310px'
                                            },
                                            '& .MuiPickersCalendarHeader-root': {
                                                padding: '0 8px',
                                                margin: 0,
                                                justifyContent: 'space-between',
                                            },
                                            '& .MuiPickersCalendarHeader-labelContainer': {
                                                color: '#202224',
                                                fontWeight: 600,
                                                fontSize: '15px',
                                                margin: 0,
                                            },
                                            '& .MuiPickersArrowSwitcher-root': {
                                                gap: '5px'
                                            },
                                            '& .MuiPickersArrowSwitcher-button': {
                                                padding: 0,
                                                backgroundColor: '#e7e9ee',
                                                borderRadius: '5px'
                                            },
                                            '& .MuiTypography-root': {
                                                color: '#454545',
                                            },

                                        },
                                    },
                                    day: {
                                        sx: {
                                            color: "#8f9091",
                                            borderRadius: '10px',
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                            },
                                            '&.MuiPickersDay-root.Mui-selected': {
                                                backgroundColor: '#4880FF',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#4880FF'
                                                }
                                            },
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{
                            flexDirection: 'column',
                        }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Đến ngày
                            </Typography>
                            <DatePicker
                                value={dayjs(toDate)}
                                format="DD/MM/YYYY"
                                onChange={(value) => setToDate(value ? value.toISOString() : dayjs().endOf("year").toISOString())}

                                sx={{
                                    "& .MuiPickersInputBase-root": {
                                        backgroundColor: '#fff',
                                        borderRadius: "10px",
                                        gap: '5px'
                                    },
                                    "& .MuiPickersSectionList-root": {
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '43px',
                                        width: 'fit-content',
                                        paddingY: '0px',
                                    },
                                }}
                                slotProps={{
                                    popper: {
                                        sx: {
                                            '& .MuiPaper-root': {
                                                borderRadius: '20px',
                                            },
                                            '& .MuiDateCalendar-root': {
                                                padding: '18px 20px 0px 20px',
                                                gap: '10px',
                                                maxHeight: '360px',
                                                height: 'auto',
                                                width: '310px'
                                            },
                                            '& .MuiPickersCalendarHeader-root': {
                                                padding: '0 8px',
                                                margin: 0,
                                                justifyContent: 'space-between',
                                            },
                                            '& .MuiPickersCalendarHeader-labelContainer': {
                                                color: '#202224',
                                                fontWeight: 600,
                                                fontSize: '15px',
                                                margin: 0,
                                            },
                                            '& .MuiPickersArrowSwitcher-root': {
                                                gap: '5px'
                                            },
                                            '& .MuiPickersArrowSwitcher-button': {
                                                padding: 0,
                                                backgroundColor: '#e7e9ee',
                                                borderRadius: '5px'
                                            },
                                            '& .MuiTypography-root': {
                                                color: '#454545',
                                            },
                                        },
                                    },
                                    day: {
                                        sx: {
                                            color: "#8f9091",
                                            borderRadius: '10px',
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                            },
                                            '&.MuiPickersDay-root.Mui-selected': {
                                                backgroundColor: '#4880FF',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#4880FF'
                                                }
                                            },
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </LocalizationProvider>
                </Box>
            </Box>

            {/* Table */}
            <BillTable
                data={filteredBills}
                searchKey={searchKey}
                handleRead={handleRead}
            />

            {/* Form */}
            <BillForm
                open={isBillFormOpen}
                onClose={() => setIsBillFormOpen(false)}
                billId={selectedBillId}
            />
        </Box>
    );
}

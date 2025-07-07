import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import { PlusCircle, } from "lucide-react";
import PartyTable from "./PartyTable";
import { IParty } from "../../interfaces/party.interface";
import ConfirmDelete from "../../components/Alert/ConfirmDelete/ConfirmDelete";
import PartyForm from "../../components/Form/PartyForm";
import BillForm from "../../components/Form/BillForm";
import PartyFilter from "../../components/Filter/PartyFilter";
import SearchBar from "../../components/SearchBar"
import { DatePicker, } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import { RoleBasedRender } from "../../components/RoleBasedRender";



type PartyKey = "groom" | "bride" | "phone" | "deposit" | "tables" | "reserveTables";

export default function PartyPage() {
    const navigate = useNavigate();

    const [parties, setParties] = useState<IParty[]>([]);
    const [halls, setHalls] = useState<any[]>([]); // Thêm state lưu danh sách sảnh
    const [searchKey, setSearchKey] = useState("");
    const [searchBy, setSearchBy] = useState<PartyKey>("groom");
    const [filterShift, setFilterShift] = useState("");
    const [filterHall, setFilterHall] = useState("");
    const [fromDate, setFromDate] = useState(dayjs().subtract(1, "month").toISOString());
    const [toDate, setToDate] = useState(dayjs().add(5, 'year').toISOString());
    const [isPartyFormOpen, setIsPartyFormOpen] = useState(false);
    const [isBillFormOpen, setIsBillFormOpen] = useState(false);
    const [isReadOnlyForm, setIsReadOnlyForm] = useState(false);
    const [editData, setEditData] = useState<IParty | null>(null);
    const [partyHallName, setPartyHallName] = useState("");
    const [billPartyData, setBillPartyData] = useState<IParty | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchParties = () => {
        fetch("http://localhost:3000/api/tieccuoi")
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((item: any, idx: number) => {
                    return {
                        code: item.MATIEC,
                        id: item._id,
                        groom: item.TENCR,
                        bride: item.TENCD,
                        phone: item.SDT,
                        shift: item.CA,
                        hall: item.MASANH,
                        date: item.NGAYDAI,
                        deposit: item.TIENCOC,
                        tables: item.SOLUONGBAN,
                        reserveTables: item.SOBANDT,
                        status: item.TRANGTHAI || "Đã đặt cọc", // ✅ Lấy đúng từ DB
                    };
                });

                setParties(mapped);
            });
    };

    useEffect(() => {
        fetchParties(); // tải danh sách tiệc cưới ban đầu
        fetch("http://localhost:3000/api/sanh")
            .then(res => res.json())
            .then(data => setHalls(data));
    }, []);

    const filteredParties = parties.filter((party) => {
        const partyDate = dayjs(party.date);
        const from = dayjs(fromDate);
        const to = dayjs(toDate);

        const matchesDate = partyDate.isAfter(from.subtract(1, 'day')) && partyDate.isBefore(to.add(1, 'day'));
        const matchesShift = filterShift ? party.shift === filterShift : true;
        const matchesHall = filterHall
            ? (halls.find(h => h._id === party.hall)?.LOAISANH === filterHall)
            : true;

        let matchesSearch = true;
        if (searchKey) {
            const value = party[searchBy];
            if (typeof value === "number") {
                matchesSearch = value === Number(searchKey);
            } else {
                matchesSearch = value?.toLowerCase().includes(searchKey.toLowerCase());
            }
        }

        return matchesDate && matchesShift && matchesHall && matchesSearch;
    });


    const handleAdd = () => {
        navigate("/dat-tiec");
    };

    const handleRead = (party: IParty, hallName: string) => {
        setIsReadOnlyForm(true);
        setPartyHallName(hallName);
        setEditData(party);
        setIsPartyFormOpen(true);
    };

    const handleEdit = (party: IParty, hallName: string) => {
        setIsReadOnlyForm(false);
        setPartyHallName(hallName);
        setEditData(party);
        setIsPartyFormOpen(true);
    };

    const handleDelete = (id: any) => {
        setDeleteId(id);
        setIsDeleteConfirmOpen(true);
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
                Danh sách tiệc cưới
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
                            <MenuItem value="phone">
                                Số điện thoại
                            </MenuItem>
                            <MenuItem value="deposit">
                                Tiền cọc
                            </MenuItem>
                            <MenuItem value="tables">
                                Số lượng bàn
                            </MenuItem>
                            <MenuItem value="reserveTables">
                                Số bàn dự trữ
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <PartyFilter
                        label="Chọn ca"
                        value={filterShift}
                        onChange={(e) => setFilterShift(e.target.value)}
                        children={["Trưa", "Tối"]}
                    />

                    <PartyFilter
                        label="Chọn loại sảnh"
                        value={filterHall}
                        onChange={(e) => setFilterHall(e.target.value)}
                        children={["A", "B", "C", "D", "E"]}
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

                <RoleBasedRender allow="NhanVien">
                    <Button
                        variant="contained"
                        startIcon={<PlusCircle />}
                        onClick={handleAdd}
                        sx={{
                            alignSelf: 'flex-end',
                            padding: '10px 30px',
                            fontSize: "14px",
                            fontWeight: "bold",
                            borderRadius: '8px',
                            backgroundColor: "#4880FF",
                            "&:hover": {
                                backgroundColor: "#3578f0",
                            },
                            textTransform: "none",
                        }}
                    >
                        Đặt tiệc
                    </Button>
                </RoleBasedRender>
            </Box>

            {/* Table */}
            <PartyTable
                data={filteredParties}
                searchKey={searchKey}
                handleRead={handleRead}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                halls={halls} // Truyền thêm prop halls
            />

            {/* Form + ConfirmDelete */}
            <PartyForm
                open={isPartyFormOpen}
                onClose={() => setIsPartyFormOpen(false)}
                onSubmit={(data) => {
                    const payload = {
                        TENCR: data.groom,
                        TENCD: data.bride,
                        SDT: data.phone,
                        CA: data.shift,
                        MASANH: data.hall,
                        NGAYDAI: data.date,
                        TIENCOC: data.deposit,
                        SOLUONGBAN: data.tables,
                        SOBANDT: data.reserveTables,
                        TRANGTHAI: data.status || "Đã đặt cọc"
                    };

                    fetch(`http://localhost:3000/api/tieccuoi/${editData?.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    })
                        .then(  (res) => {

                            if (!res.ok) throw new Error("Sửa thất bại");
                            return res.json();
                        })
                        .then(() => {
                            fetchParties(); // load lại data mới nhất
                        })
                        .catch((err) => {
                            console.error("Lỗi khi sửa:", err);
                            alert("Sửa thất bại, vui lòng thử lại.");
                        });

                    setIsPartyFormOpen(false);
                    setEditData(null);
                }}

                onExportBill={(partyData) => {
                    setBillPartyData(partyData);
                    setIsPartyFormOpen(false);
                    setIsBillFormOpen(true);
                }}
                initialData={editData}
                readOnly={isReadOnlyForm}
                hallName={partyHallName}
            />

            <BillForm
                open={isBillFormOpen}
                onClose={() => setIsBillFormOpen(false)}
                initialData={billPartyData}
                readOnly={true}
            />

            <ConfirmDelete
                open={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={() => {
                    if (!deleteId) return;

                    fetch(`http://localhost:3000/api/tieccuoi/${deleteId}`, {
                        method: 'DELETE',
                    })
                        .then((res) => {
                            if (!res.ok) throw new Error("Xóa thất bại");

                            // Xóa khỏi state
                            setParties((prev) => prev.filter(p => p.id !== deleteId));
                        })
                        .catch((err) => {
                            console.error("Lỗi khi xóa:", err);
                            alert("Xóa thất bại, vui lòng thử lại.");
                        })
                        .finally(() => {
                            setIsDeleteConfirmOpen(false);
                            setDeleteId(null);
                        });
                }}

            />

        </Box>
    );
}

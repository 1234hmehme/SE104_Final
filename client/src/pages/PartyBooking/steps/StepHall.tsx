import { Box, Card, CardContent, CardMedia, FormControl, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { defaultBgColorMap, defaultTextColorMap } from "../../../assets/color/ColorMap";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import { useState, useEffect } from "react";
import SearchBar from "../../../components/SearchBar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import HallDetailMenu from "../../../components/Menu/HallDetailMenu";


// Hàm gán ảnh minh họa dựa vào tên sảnh
import hallA1Image from "../../../assets/ảnh 1.webp";
import hallA2Image from "../../../assets/ảnh 2.webp";
import hallA3Image from "../../../assets/ảnh 3.jpg";
import hallB1Image from "../../../assets/ảnh 4.jpg";
import hallB2Image from "../../../assets/ảnh 5.jpg";
import hallB3Image from "../../../assets/ảnh 6.png";
import hallC1Image from "../../../assets/ảnh 7.jpg";
import hallC2Image from "../../../assets/ảnh 8.jpg";
import hallC3Image from "../../../assets/ảnh 9.jpg";
import hallD1Image from "../../../assets/ảnh 10.jpg";
import hallD2Image from "../../../assets/ảnh 11.jpg";
import hallD3Image from "../../../assets/ảnh 12.jpg";
import hallE1Image from "../../../assets/ảnh 13.jpg";
import hallE2Image from "../../../assets/ảnh 14.jpeg";
import hallE3Image from "../../../assets/ảnh 15.jpg";
import { IHall } from "../../../interfaces/hall.interface";

function getHallImage(tenSanh: string) {
    const ten = tenSanh.toLowerCase();
    if (ten.includes("grand ballroom a1")) return hallA1Image;
    if (ten.includes("crystal hall a2")) return hallA2Image;
    if (ten.includes("diamond suite a3")) return hallA3Image;
    if (ten.includes("pearl grand b1")) return hallB1Image;
    if (ten.includes("b2")) return hallB2Image;
    if (ten.includes("b3")) return hallB3Image;
    if (ten.includes("c1")) return hallC1Image;
    if (ten.includes("c2")) return hallC2Image;
    if (ten.includes("c3")) return hallC3Image;
    if (ten.includes("d1")) return hallD1Image;
    if (ten.includes("d2")) return hallD2Image;
    if (ten.includes("d3")) return hallD3Image;
    if (ten.includes("e1")) return hallE1Image;
    if (ten.includes("e2")) return hallE2Image;
    if (ten.includes("e3")) return hallE3Image;
    return "https://via.placeholder.com/400x220?text=No+Image";
}

const NullHall = {
    id: "",
    name: "",
    type: "A",
    maxTable: 0,
    minTablePrice: 0,
    description: "",
    image: '',
};

export default function StepHall() {
    const { watch, setValue, control, register, formState: { errors }, setError, clearErrors } = useFormContext();
    const [searchKey, setSearchKey] = useState("");
    const [isDetailMenuOpen, setIsDetailMenuOpen] = useState(false);
    const [halls, setHalls] = useState<any[]>([]);
    const [bookedHallIds, setBookedHallIds] = useState<string[]>([]);


    const selectedDate = watch("date");
    const selectedShift = watch("shift");

    // Kiểm tra nếu ngày và ca đã được chọn

    useEffect(() => {
        if (selectedDate && selectedShift) {
            fetch("http://localhost:3000/api/tieccuoi")
                .then(r => r.json())
                .then((list: any[]) => {
                    console.log("Tất cả tiệc:", list);
                    // chỉ lấy những tiệc có cùng ngày & ca
                    const booked = list
                        .filter(x => dayjs(x.NGAYDAI).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD") && x.CA === selectedShift)
                        .map(x => x.MASANH);


                    console.log(
                        `Booked halls on ${selectedDate} (${selectedShift}):`,
                        booked
                    );
                    setBookedHallIds(booked);
                });
        } else {
            setBookedHallIds([]);
        }
    }, [selectedDate, selectedShift]);

    // Fetch halls từ backend và gán ảnh minh họa ở FE
    useEffect(() => {
        fetch("http://localhost:3000/api/sanh")
            .then(res => res.json())
            .then(data => setHalls(data.map((item: any) => ({
                id: item._id,
                name: item.TENSANH,
                type: item.LOAISANH,
                maxTable: item.SOLUONGBANTD,
                minTablePrice: item.DONGIABANTT,
                description: item.GHICHU,
                image: getHallImage(item.TENSANH),
            }))));
    }, []);

    const tables = Number(watch("tables") || 0);
    const reserveTables = Number(watch("reserveTables") || 0);
    const totalTables = (tables + reserveTables) || 0;

    const selectedHall = watch("hall") || NullHall;

    const filteredHalls = halls.filter((hall) => {
        const matchesTables = hall.maxTable >= totalTables;
        return hall.name.toLowerCase().includes(searchKey.toLowerCase())
            && matchesTables;
    });

    // useEffect(() => {
    //     register("hall", { required: "Vui lòng chọn một sảnh" });

    // }, [register]);

    const onSelectHall = (hall: IHall) => {
        setValue("hall", hall, { shouldValidate: true });
    };

    return (
        <Box sx={{
            display: 'flex', gap: '20px', height: '100%'
        }}>

            <Controller
                name="hall"
                control={control}
                defaultValue={null}
                rules={{ required: "Vui lòng chọn một sảnh" }}
                render={({ field }) => (
                    totalTables > 0 && selectedDate && selectedShift ? (
                        <Box sx={{
                            flex: 1,
                            overflowY: 'auto',
                            pr: 1,
                        }}>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                rowGap: '20px',
                                columnGap: { sm: '3%', md: '2%' },
                                padding: '3px'
                            }}>
                                {filteredHalls.map(hall => {
                                    const isBooked = bookedHallIds.includes(hall.id);
                                    return (
                                        <Card
                                            key={hall.id}
                                            onClick={() => {
                                                if (isBooked) {
                                                    setError("hall", {
                                                        type: "manual",
                                                        message: "Sảnh này đã được đặt, vui lòng chọn sảnh khác",
                                                    });

                                                } else {

                                                    clearErrors("hall");
                                                    field.onChange(hall);
                                                }

                                            }}
                                            sx={{
                                                borderRadius: 3,
                                                cursor: "pointer",
                                                border:
                                                    selectedHall?.id === hall.id
                                                        ? "3px solid #4880FF"
                                                        : "1px solid #ccc",
                                                boxShadow: selectedHall?.id === hall.id ? 4 : 1,
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={hall.image}
                                                sx={{
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                    height: 200,
                                                }}
                                            />
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}>
                                                    <Typography
                                                        onClick={() => { setIsDetailMenuOpen(true) }}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: '18px',
                                                            '&:hover': {
                                                                color: '#4880FF',
                                                            },
                                                        }}
                                                    >
                                                        {hall.name}
                                                    </Typography>

                                                    <Box sx={{
                                                        display: 'flex',
                                                        width: '25px',
                                                        height: '25px',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 2,
                                                        backgroundColor: defaultBgColorMap[hall.type],
                                                        color: defaultTextColorMap[hall.type],
                                                        fontWeight: 'bold',
                                                        zIndex: 100
                                                    }}>
                                                        {hall.type}
                                                    </Box>
                                                </Box>

                                                <Typography sx={{
                                                    display: "-webkit-box",
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: 'hidden',
                                                    WebkitLineClamp: 2,
                                                    color: 'GrayText',
                                                    fontSize: '14px',
                                                    height: '45px',
                                                }}>
                                                    {hall.description}
                                                </Typography>

                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <TableRestaurantIcon sx={{ fontSize: '1rem', mr: 0.5, }} />
                                                        <Typography color="text.secondary" fontSize={14}>
                                                            Tối đa: {hall.maxTable} bàn
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <TableRestaurantIcon sx={{ fontSize: '1rem', mr: 0.5, }} />
                                                        <Typography color="text.secondary" fontSize={14}>
                                                            Đơn giá bàn tối thiểu: {hall.minTablePrice?.toLocaleString('vi-VN')} VND
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </Box>
                        </Box>
                    ) : (
                        <Typography sx={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: "gray",
                        }}>
                            Vui lòng nhập thông tin
                        </Typography>


                    )
                )}
            />

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: { xs: '170px', md: '300px' },
                gap: '15px',
                padding: '2px'
            }}>
                <SearchBar
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                />

                <Controller
                    name="tables"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Vui lòng nhập số bàn " }}
                    render={({ field }) => (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                                Số lượng bàn:
                            </Typography>
                            <TextField
                                type="number"
                                error={!!errors.tables}
                                sx={{
                                    width: '90px',
                                    "& fieldset": {
                                        borderRadius: "10px",
                                    },
                                    "& .MuiInputBase-input": {
                                        padding: "8px 10px",
                                    },
                                }}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </Box>
                    )}
                />

                <Controller
                    name="reserveTables"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Vui lòng nhập số bàn dự trữ" }}
                    render={({ field }) => (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                                Số bàn dự trữ:
                            </Typography>
                            <TextField
                                type="number"

                                error={!!errors.reserveTables}
                                sx={{
                                    width: '90px',
                                    "& fieldset": {
                                        borderRadius: "10px",
                                    },
                                    "& .MuiInputBase-input": {
                                        padding: "8px 10px",
                                    },
                                }}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </Box>
                    )}
                />
                <Controller
                    name="shift"
                    control={control}
                    defaultValue="Trưa"
                    render={({ field }) => (
                        <FormControl sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            "& fieldset": {
                                borderRadius: "10px",
                            },
                            "& .MuiInputBase-input": {
                                display: 'flex',
                                alignItems: 'center',
                                paddingY: '6px',
                                paddingLeft: "13px",
                                backgroundColor: '#fff',
                            },
                        }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                                Ca:
                            </Typography>
                            <Select
                                {...field}
                                sx={{ width: '90px', }}
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
                                {["Trưa", "Tối"].map((item) =>
                                    <MenuItem value={item} key={item}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            paddingX: '7px',
                                            paddingY: '2px',
                                            borderRadius: '6px',
                                            backgroundColor: defaultBgColorMap[item],
                                            color: defaultTextColorMap[item],
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            zIndex: 100,
                                        }}>
                                            {item}
                                        </Box>
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    name="date"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <FormControl sx={{
                                gap: '3px'
                            }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                                    Ngày tổ chức
                                </Typography>
                                <DatePicker
                                    {...field}
                                    format="DD/MM/YYYY"
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(value) => field.onChange((value?.toDate() || new Date()).toString())}
                                    sx={{
                                        "& .MuiPickersInputBase-root": {
                                            backgroundColor: '#fff',
                                            borderRadius: "10px",
                                            gap: '5px',
                                            '& .MuiPickersOutlinedInput-root.Mui-error .MuiPickersOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(0, 0, 0, 0.23)'
                                            }
                                        },
                                        "& .MuiPickersSectionList-root": {
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: '50px',
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
                            </FormControl>
                        </LocalizationProvider>
                    )}
                />

                {errors.hall && (
                    <Typography color="error" fontSize="18px">
                        {errors.hall.message}
                    </Typography>
                )}

                {(errors.tables || errors.reserveTables) && (
                    <Typography color="error" fontSize="18px">
                        {errors.tables?.message || errors.reserveTables?.message}
                    </Typography>
                )}
            </Box>


            <HallDetailMenu
                open={isDetailMenuOpen}
                onClose={() => setIsDetailMenuOpen(false)}
                initialData={selectedHall}
            />
        </Box>

    );
}
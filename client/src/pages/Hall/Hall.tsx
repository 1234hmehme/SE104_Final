import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
    Button,
} from "@mui/material";
import PetalAnimation from '../../components/Animations/PetalAnimation';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ConfirmDelete from '../../components/Alert/ConfirmDelete.tsx';
import AddHallDialog from './AddHallDialog.tsx';
import EditHallDialog from './EditHallDialog.tsx';
import hallA1Image from "../../assets/ảnh 1.webp";
import hallA2Image from "../../assets/ảnh 2.webp";
import hallA3Image from "../../assets/ảnh 3.jpg";
import hallB1Image from "../../assets/ảnh 4.jpg";
import hallB2Image from "../../assets/ảnh 5.jpg";
import hallB3Image from "../../assets/ảnh 6.png";
import hallC1Image from "../../assets/ảnh 7.jpg";
import hallC2Image from "../../assets/ảnh 8.jpg";
import hallC3Image from "../../assets/ảnh 9.jpg";
import hallD1Image from "../../assets/ảnh 10.jpg";
import hallD2Image from "../../assets/ảnh 11.jpg";
import hallD3Image from "../../assets/ảnh 12.jpg";
import hallE1Image from "../../assets/ảnh 13.jpg";
import hallE2Image from "../../assets/ảnh 14.jpeg";
import hallE3Image from "../../assets/ảnh 15.jpg";
import { RoleBasedRender } from "../../components/RoleBasedRender.tsx";
import SearchBar from "../../components/SearchBar.tsx";
import { defaultBgColorMap, defaultTextColorMap } from "../../assets/color/ColorMap.ts";

interface IHallInfo {
    _id: string;
    TENSANH: string;
    LOAISANH: string;
    SOLUONGBANTD: number;
    DONGIABANTT: number;
    GHICHU: string;
    image?: string;
}
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

export default function HallPage() {
    const [selectedHall, setSelectedHall] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [openAddHallDialog, setOpenAddHallDialog] = useState<boolean>(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
    const [hallToDelete, setHallToDelete] = useState<string | null>(null);
    const [openEditHallDialog, setOpenEditHallDialog] = useState<boolean>(false);
    const [hallToEdit, setHallToEdit] = useState<IHallInfo | null>(null);
    const [halls, setHalls] = useState<IHallInfo[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/sanh")
            .then(res => res.json())
            .then(data => setHalls(data));
    }, []);

    const handleAddHall = (newHall: IHallInfo) => {
        setHalls(prev => [...prev, newHall]);
    };

    const filteredHalls = halls.filter(hall =>
        hall.TENSANH.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedType === 'all' || hall.LOAISANH === selectedType)
    );
    const handleUpdateHall = async (updatedHall: IHallInfo) => {
        // Gọi API cập nhật
        await fetch(`http://localhost:3000/api/sanh/${updatedHall._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedHall),
        });
        // Lấy lại danh sách mới từ DB
        const res = await fetch("http://localhost:3000/api/sanh");
        const data = await res.json();
        setHalls(data);
    };
    const handleHallClick = (_id: string) => {
        setSelectedHall(_id);
    };

    const handleCloseDialog = () => {
        setSelectedHall(null);
    };

    const handleOpenAddHallDialog = () => {
        setOpenAddHallDialog(true);
    };

    const handleCloseAddHallDialog = () => {
        setOpenAddHallDialog(false);
    };

    const handleDeleteClick = (_id: string) => {
        setHallToDelete(_id);
        setOpenConfirmDelete(true);
    };

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false);
        setHallToDelete(null);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        setSelectedType(event.target.value);
    };

    const handleEditClick = (_id: string) => {
        const hall = halls.find(h => h._id === _id);
        setHallToEdit(hall || null);
        setOpenEditHallDialog(true);
    };

    const handleCloseEditHallDialog = () => {
        setOpenEditHallDialog(false);
        setHallToEdit(null);
    };
    const handleConfirmDelete = async () => {
        if (!hallToDelete) return;
        // Gọi API xóa
        await fetch(`http://localhost:3000/api/sanh/${hallToDelete}`, {
            method: "DELETE",
        });
        // Cập nhật lại state halls
        setHalls(prev => prev.filter(hall => hall._id !== hallToDelete));
        setOpenConfirmDelete(false);
        setHallToDelete(null);
    };
    const hallTypes = ["A", "B", "C", "D", "E"];

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: "100vh",
            overflow: 'auto',
            backgroundColor: '#fff',
            borderRadius: '15px',
            padding: '20px',
            boxSizing: 'border-box',
        }}>
            <PetalAnimation />
            <Typography
                sx={{
                    userSelect: "none",
                    fontWeight: "bold",
                    fontSize: "32px",
                    marginX: "20px",
                }}
            >
                Danh sách sảnh
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: "40px",
                    marginX: "20px",
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: '10px',
                    width: "60%",
                    alignItems: 'flex-end',
                }}>
                    <Box sx={{ flex: 3, }}>
                        <SearchBar
                            value={searchQuery}
                            onChange={handleSearchChange} />
                    </Box>

                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Chọn loại sảnh
                        </Typography>
                        <FormControl sx={{
                            "& fieldset": {
                                borderRadius: "10px",
                            },
                            "& .MuiInputBase-input": {
                                paddingY: "10px",
                                paddingLeft: "14px",
                                backgroundColor: '#fff',
                            },
                        }}>
                            <Select
                                value={selectedType}
                                onChange={handleTypeChange}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>

                                {hallTypes.map((item) =>
                                    <MenuItem value={item}
                                        sx={{
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'inline-flex',
                                            paddingX: 1.5,
                                            paddingY: 0.5,
                                            borderRadius: 2,
                                            backgroundColor: defaultBgColorMap[item],
                                            color: defaultTextColorMap[item],
                                            fontWeight: 'bold',
                                            zIndex: 100
                                        }}>
                                            Loại {item}
                                        </Box>
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <RoleBasedRender allow="Admin">
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                            alignSelf: 'flex-end',
                            padding: '10px 30px',
                            fontSize: "14px",
                            fontWeight: "bold",
                            borderRadius: '8px',
                            backgroundColor: '#4880FF',
                            '&:hover': {
                                backgroundColor: "#3578f0",
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                            },
                            textTransform: "none",
                        }}
                        onClick={handleOpenAddHallDialog}
                    >
                        Thêm sảnh
                    </Button>
                </RoleBasedRender>
            </Box>

            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                '& > *': {
                    flex: '0 1 calc(25% - 18px)',
                    minWidth: '240px',
                    maxWidth: '1fr',
                }
            }}>
                {filteredHalls.map((hall) => (
                    <Card
                        key={hall._id}
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            },
                            position: 'relative',
                        }}
                        onClick={() => handleHallClick(hall._id)}
                    >
                        <RoleBasedRender allow="Admin">
                            <Box sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                display: 'flex',
                                gap: 1,
                                zIndex: 2,
                            }} onClick={e => e.stopPropagation()}>
                                <Button size="small" sx={{ minWidth: 0, p: 0.5 }} onClick={() => handleEditClick(hall._id)}>
                                    <Box
                                        sx={{
                                            bgcolor: '#fff',
                                            borderRadius: '50%',
                                            p: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            transition: 'background 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                bgcolor: '#f0f0f0',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                            }
                                        }}
                                    >
                                        <EditIcon fontSize="small" sx={{ color: '#00e1ff', opacity: 0.85, transition: 'opacity 0.2s' }} />
                                    </Box>
                                </Button>
                                <Button size="small" sx={{ minWidth: 0, p: 0.5 }} onClick={() => handleDeleteClick(hall._id)}>
                                    <Box
                                        sx={{
                                            bgcolor: '#fff',
                                            borderRadius: '50%',
                                            p: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            transition: 'background 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                bgcolor: '#f0f0f0',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" sx={{ color: '#ff0000', opacity: 0.85, transition: 'opacity 0.2s' }} />
                                    </Box>
                                </Button>
                            </Box>
                        </RoleBasedRender>

                        <CardMedia
                            component="img"
                            image={getHallImage(hall.TENSANH)}
                            alt={`Sảnh ${hall.TENSANH}`}
                            sx={{
                                width: '100%',
                                objectFit: 'cover',
                                height: 220,
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                            }}
                        />
                        <CardContent sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.5rem' }}>
                                    {hall.TENSANH}
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {hall.GHICHU}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AttachMoneyIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Đơn giá bàn tối thiểu: {hall.DONGIABANTT.toLocaleString('vi-VN')} VNĐ
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TableRestaurantIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Tối đa: {hall.SOLUONGBANTD} bàn
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Dialog
                open={selectedHall !== null}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        p: 0,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                    }
                }}
            >
                {selectedHall && (() => {
                    const hallDetails = halls.find(h => h._id === selectedHall);
                    if (!hallDetails) return null;
                    return (
                        <Box>
                            <Box sx={{ width: '100%', height: 240, overflow: 'hidden' }}>
                                <img src={getHallImage(hallDetails.TENSANH)} alt={hallDetails.TENSANH} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2a3b5d', mb: 1, textAlign: 'center' }}>
                                    {hallDetails.TENSANH}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TableRestaurantIcon sx={{ color: '#4880FF' }} />
                                        <Typography variant="body1">Loại: <b>{hallDetails.LOAISANH}</b></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AttachMoneyIcon sx={{ color: '#00b894' }} />
                                        <Typography variant="body1">Giá bàn: <b>{hallDetails.DONGIABANTT.toLocaleString('vi-VN')} VNĐ</b></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TableRestaurantIcon sx={{ color: '#ff9800' }} />
                                        <Typography variant="body1">Tối đa: <b>{hallDetails.SOLUONGBANTD}</b> bàn</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#555', textAlign: 'center', mb: 2 }}>
                                    {hallDetails.GHICHU}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })()}
            </Dialog>

            <AddHallDialog open={openAddHallDialog} onClose={handleCloseAddHallDialog} hallTypes={hallTypes} onAddHall={handleAddHall} />
            <EditHallDialog open={openEditHallDialog} onClose={handleCloseEditHallDialog} hall={hallToEdit} hallTypes={hallTypes} onUpdateHall={handleUpdateHall} />
            <ConfirmDelete open={openConfirmDelete} onClose={handleCloseConfirmDelete} onConfirm={handleConfirmDelete} />
        </Box>
    );
}
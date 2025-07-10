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
    Button,
    Snackbar,
    Alert,
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
import { RoleBasedRender } from "../../components/RoleBasedRender.tsx";
import SearchBar from "../../components/SearchBar.tsx";
import { defaultBgColorMap, defaultTextColorMap } from "../../assets/color/ColorMap.ts";
import sanhApi from "../../apis/sanhApis.ts";

export interface IHallInfo {
    _id: string;
    TENSANH: string;
    LOAISANH: string;
    SOLUONGBANTD: number;
    DONGIABANTT: number;
    GHICHU: string;
    HINHANH: string;
}

export default function HallPage() {
    const [selectedHall, setSelectedHall] = useState<IHallInfo | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [openAddHallDialog, setOpenAddHallDialog] = useState<boolean>(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
    const [hallToDelete, setHallToDelete] = useState<string | null>(null);
    const [openEditHallDialog, setOpenEditHallDialog] = useState<boolean>(false);
    const [hallToEdit, setHallToEdit] = useState<IHallInfo | null>(null);
    const [halls, setHalls] = useState<IHallInfo[]>([]);

    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const fetchHalls = async () => {
        try {
            const data = await sanhApi.getAll();

            const mapped = data.map((item: any) => ({
                _id: item._id,
                TENSANH: item.TENSANH,
                LOAISANH: item.LOAISANH,
                SOLUONGBANTD: item.SOLUONGBANTD,
                DONGIABANTT: item.DONGIABANTT,
                GHICHU: item.GHICHU,
                HINHANH: item.HINHANH,
            }));

            setHalls(mapped);
        } catch (err) {
            console.error("Lỗi khi fetch sảnh:", err);
        }
    };

    useEffect(() => {
        fetchHalls();
    }, []);

    useEffect(() => {
        if (openSnackbar) {
            const timer = setTimeout(() => setOpenSnackbar(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [openSnackbar]);

    const handleSuccess = async (message: string) => {
        await fetchHalls();
        setSuccessMessage(message);
        setOpenSnackbar(true);
    };

    const handleFail = async (message: string) => {
        setSuccessMessage(message);
        setOpenSnackbar(true);
    }

    const filteredHalls = halls.filter(hall =>
        hall.TENSANH.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedType === 'all' || hall.LOAISANH === selectedType)
    );

    const handleDeleteClick = (_id: string) => {
        setHallToDelete(_id);
        setOpenConfirmDelete(true);
    };

    const handleEditClick = (hall: IHallInfo) => {
        setHallToEdit(hall);
        setOpenEditHallDialog(true);
    };

    const handleCloseEditHallDialog = () => {
        setOpenEditHallDialog(false);
        setHallToEdit(null);
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
                            onChange={(e) => setSearchQuery(e.target.value)} />
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
                                onChange={(e) => setSelectedType(e.target.value)}
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
                        onClick={() => setOpenAddHallDialog(true)}
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
                        onClick={() => setSelectedHall(hall)}
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
                                <Button size="small" sx={{ minWidth: 0, p: 0.5 }} onClick={() => handleEditClick(hall)}>
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
                            image={hall.HINHANH}
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
                onClose={() => setSelectedHall(null)}
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
                    return (
                        <Box>
                            <Box sx={{ width: '100%', height: 240, overflow: 'hidden' }}>
                                <img src={selectedHall.HINHANH} alt={selectedHall.TENSANH} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2a3b5d', mb: 1, textAlign: 'center' }}>
                                    {selectedHall.TENSANH}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TableRestaurantIcon sx={{ color: '#4880FF' }} />
                                        <Typography variant="body1">Loại: <b>{selectedHall.LOAISANH}</b></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AttachMoneyIcon sx={{ color: '#00b894' }} />
                                        <Typography variant="body1">Giá bàn: <b>{selectedHall.DONGIABANTT.toLocaleString('vi-VN')} VNĐ</b></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TableRestaurantIcon sx={{ color: '#ff9800' }} />
                                        <Typography variant="body1">Tối đa: <b>{selectedHall.SOLUONGBANTD}</b> bàn</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#555', textAlign: 'center', mb: 2 }}>
                                    {selectedHall.GHICHU}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })()}
            </Dialog>

            <AddHallDialog
                open={openAddHallDialog}
                onClose={() => setOpenAddHallDialog(false)}
                onSuccess={handleSuccess}
                onFail={handleFail}
                hallTypes={hallTypes}
            />
            <EditHallDialog
                open={openEditHallDialog}
                onClose={handleCloseEditHallDialog}
                hall={hallToEdit} hallTypes={hallTypes}
                onSuccess={handleSuccess}
                onFail={handleFail}
            />

            <ConfirmDelete
                open={openConfirmDelete}
                onClose={() => setOpenConfirmDelete(false)}
                onConfirm={async () => {
                    if (!hallToDelete) return;

                    try {
                        await sanhApi.delete(hallToDelete);
                        handleSuccess("Xóa sảnh thành công");
                    } catch (err) {
                        console.error("Lỗi khi xóa:", err);
                        handleFail("Xóa sảnh thất bại");
                    } finally {
                        setOpenConfirmDelete(false);
                        setHallToDelete(null);
                    }
                }}
            />

            <Snackbar open={openSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center', }}>
                <Alert severity="success" sx={{ width: '100%', borderRadius: '10px' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
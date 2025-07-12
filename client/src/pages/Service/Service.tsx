import { useEffect, useState } from 'react';
import './Service.css';
import { Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ServiceAddDialog from './ServiceAddDialog.tsx';
import ServiceEditDialog from './ServiceEditDialog.tsx';
import ConfirmDelete from '../../components/Alert/ConfirmDelete.tsx';
import ServiceDetailMenu from '../../components/Menu/ServiceDetailMenu';
import PetalAnimation from '../../components/Animations/PetalAnimation';
import SearchBar from '../../components/SearchBar';
import { RoleBasedRender } from '../../components/RoleBasedRender.tsx';
import { IService } from '../../interfaces/service.interface.ts';
import dichvuApi from '../../apis/dichvuApis.ts';

export default function Service() {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const categories = ['Tất cả', 'Trang Trí', 'MC & Ca Sĩ', 'Quay Chụp', 'Làm Đẹp', 'Trang Phục', 'Phương Tiện', 'Thiệp & Quà', 'Bánh & Rượu', 'An Ninh'];
    const [openAddServiceDialog, setOpenAddServiceDialog] = useState(false);
    const [openEditServiceDialog, setOpenEditServiceDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<IService | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<IService | null>(null);
    const [services, setServices] = useState<IService[]>([]);
    const [searchKey, setSearchKey] = useState("");

    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const fetchServices = async () => {
        try {
            const data = await dichvuApi.getAll();

            const mapped = data.map((item: any) => ({
                _id: item._id,
                name: item.TENDICHVU,
                description: item.GHICHU,
                price: item.DONGIA,
                category: item.DANHMUC,
                image: item.HINHANH,
            }));

            setServices(mapped);
        } catch (err) {
            console.error("Lỗi khi fetch dịch vụ:", err);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (openSnackbar) {
            const timer = setTimeout(() => setOpenSnackbar(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [openSnackbar]);

    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'Tất cả' || service.category === selectedCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchKey.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSuccess = async (message: string) => {
        await fetchServices();
        setSuccessMessage(message);
        setOpenSnackbar(true);
    };

    const handleFail = async (message: string) => {
        setSuccessMessage(message);
        setOpenSnackbar(true);
    }

    const handleDeleteClick = (_id: string) => {
        setServiceToDelete(_id);
        setOpenDeleteDialog(true);
    };

    const handleEditClick = (service: IService) => {
        setServiceToEdit(service);
        setOpenEditServiceDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditServiceDialog(false);
        setServiceToEdit(null);
    };

    const handleServiceClick = (service: IService) => {
        setSelectedService(service);
        setDetailDialogOpen(true);
    };

    return (
        <Box sx={{ background: '#f5f6fa', minHeight: '100vh', p: 0, position: 'relative', overflow: 'hidden' }}>

            <Box sx={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(2px)', borderRadius: 3, p: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.04)', maxWidth: 1400, mx: 'auto', width: '100%', position: 'relative', zIndex: 1 }}>
                <Box sx={{ height: '100vh', overflowY: 'auto', pr: 2 }}>
                    <div className="service-container">
                        <PetalAnimation />
                        <Typography
                            sx={{
                                userSelect: "none",
                                color: "var(--text-color)",
                                fontWeight: "bold",
                                fontSize: "32px",
                                marginBottom: "20px",
                                textAlign: 'left',
                            }}
                        >
                            Dịch Vụ Đám Cưới
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
                                width: "40%",
                            }}>
                                <SearchBar
                                    value={searchKey}
                                    onChange={e => setSearchKey(e.target.value)} />
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
                                    onClick={() => setOpenAddServiceDialog(true)}
                                >
                                    Thêm dịch vụ
                                </Button>
                            </RoleBasedRender>
                        </Box>

                        <div className="category-filter">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="service-grid" style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 24,
                            justifyContent: 'flex-start',
                        }}>
                            {filteredServices.map((service: IService) => (
                                <div key={service._id} className="service-card" style={{
                                    flex: '0 1 calc(25% - 18px)',
                                    minWidth: '240px',
                                    maxWidth: '1fr',
                                    position: 'relative',
                                    cursor: 'pointer',
                                }}
                                    onClick={() => handleServiceClick(service)}
                                >
                                    <RoleBasedRender allow="Admin">
                                        <div style={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            display: 'flex',
                                            gap: 8,
                                            zIndex: 2
                                        }}>
                                            <Button size="small" sx={{ minWidth: 0, p: 0.5 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(service);
                                                }}>
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
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            bgcolor: '#f0f0f0',
                                                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                                            '& .MuiSvgIcon-root': { opacity: 1 }
                                                        }
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" sx={{ color: '#00e1ff', opacity: 0.85, transition: 'opacity 0.2s' }} />
                                                </Box>
                                            </Button>
                                            <Button size="small" sx={{ minWidth: 0, p: 0.5 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(service._id);
                                                }}>
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
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            bgcolor: '#f0f0f0',
                                                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                                            '& .MuiSvgIcon-root': { opacity: 1 }
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" sx={{ color: '#ff0000', opacity: 0.85, transition: 'opacity 0.2s' }} />
                                                </Box>
                                            </Button>
                                        </div>
                                    </RoleBasedRender>
                                    <img src={service.image} alt={service.name} className="service-image" />                        <div className="service-info">
                                        <h3>{service.name}</h3>
                                        <p>{service.description}</p>
                                        <p className="service-price">{service.price.toLocaleString('vi-VN')} VNĐ</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <ServiceAddDialog
                            open={openAddServiceDialog}
                            onClose={() => setOpenAddServiceDialog(false)}
                            onSuccess={handleSuccess}
                            onFail={handleFail}
                            categories={categories}
                        />
                        
                        <ServiceEditDialog
                            open={openEditServiceDialog}
                            onClose={handleCloseEditDialog}
                            service={serviceToEdit}
                            categories={categories}
                            onSuccess={handleSuccess}
                            onFail={handleFail}
                        />

                        <ConfirmDelete
                            open={openDeleteDialog}
                            onClose={() => setOpenDeleteDialog(false)}
                            onConfirm={async () => {
                                if (!serviceToDelete) return;

                                try {
                                    await dichvuApi.delete(serviceToDelete);
                                    handleSuccess("Xóa dịch vụ thành công");
                                } catch (err) {
                                    console.error("Lỗi khi xóa:", err);
                                    handleFail("Xóa dịch vụ thất bại");
                                } finally {
                                    setOpenDeleteDialog(false);
                                    setServiceToDelete(null);
                                }
                            }}
                        />

                        {selectedService && (
                            <ServiceDetailMenu
                                open={detailDialogOpen}
                                onClose={() => setDetailDialogOpen(false)}
                                initialData={selectedService}
                            />
                        )}

                        <Snackbar open={openSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center', }}>
                            <Alert severity="success" sx={{ width: '100%', borderRadius: '10px' }}>
                                {successMessage}
                            </Alert>
                        </Snackbar>
                    </div>
                </Box>
            </Box>
        </Box>
    );
}

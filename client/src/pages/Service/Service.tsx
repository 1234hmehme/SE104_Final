import { useEffect, useState } from 'react';
import { Service as ServiceType } from './serviceData';
import './Service.css';
// import { IService } from '../../interfaces/service.interface';
import { Button, Typography, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ServiceAddDialog from './ServiceAddDialog.tsx';
import ServiceEditDialog from './ServiceEditDialog.tsx';
import ConfirmDelete from '../../components/Alert/ConfirmDelete/ConfirmDelete';
import ServiceDetailMenu from '../../components/Menu/ServiceDetailMenu';
import PetalAnimation from '../../components/Animations/PetalAnimation';
import SearchBar from '../../components/SearchBar';
import { RoleBasedRender } from '../../components/RoleBasedRender.tsx';
import { IService } from '../../interfaces/service.interface.ts';
function getServiceImage(service: string) {
    const ten = service ? service.toLowerCase() : '';
    if (ten.includes('trang trí sảnh tiệc')) return 'https://nhahanghuonglieusunflower.com/wp-content/uploads/2023/06/Trang-tri-sanh-tiec-cuoi-1.jpg';
    if (ten.includes('trang trí bàn tiệc')) return 'https://cdn.tgdd.vn/2021/12/CookDishThumb/cach-trang-tri-ban-tiec-ngot-doc-dao-moi-la-ap-dung-duoc-cho-thumb-620x620.jpg';
    if (ten.includes('trang trí lễ đường')) return 'https://tse1.mm.bing.net/th/id/OIP.-puz0hvMSoSpr8ow03r1RwEyDM?rs=1&pid=ImgDetMain';
    if (ten.includes('mc chuyên nghiệp')) return 'https://webdamcuoi.com/wp-content/uploads/2022/01/mc-dam-cuoi-1024x570.jpg';
    if (ten.includes('ca sĩ hát live')) return 'https://tse2.mm.bing.net/th/id/OIP.RJBQRtjbja59537YUUsmegHaE7?rs=1&pid=ImgDetMain';
    if (ten.includes('ban nhạc sống')) return 'https://tse3.mm.bing.net/th/id/OIP.kM2F15lLcH9e4RdqCzMDnwHaE7?rs=1&pid=ImgDetMain';
    if (ten.includes('quay phim chuyên nghiệp')) return 'https://tse4.mm.bing.net/th/id/OIP.gx2kWyON409-DaK5YOpORAHaEi?rs=1&pid=ImgDetMain';
    if (ten.includes('chụp ảnh cưới')) return 'https://toplist.vn/images/800px/ah-studio-692689.jpg';
    if (ten.includes('trang điểm cô dâu')) return 'https://th.bing.com/th/id/R.1b26497fc5b8d280cef2e540e1f58639?rik=NcCaAEts4QRg0Q&pid=ImgRaw&r=0';
    if (ten.includes('làm tóc cô dâu')) return 'https://erocante.vn/wp-content/uploads/2021/01/kieu-toc-cho-co-dau-mat-dai.jpg';
    if (ten.includes('áo dài cưới')) return 'https://th.bing.com/th/id/R.e1c951e3746adb79924709cf649c2f39?rik=xKA8HSRnShOAZg&pid=ImgRaw&r=0';
    if (ten.includes('vest cưới')) return 'https://th.bing.com/th/id/R.d5124a32bd990d59da2ad88db0d581dc?rik=0R8AcCkW8Ypwww&pid=ImgRaw&r=0';
    if (ten.includes('xe hoa')) return 'https://tse3.mm.bing.net/th/id/OIP.YwPx-ViAOArJbQ6sXgoIBwHaEo?rs=1&pid=ImgDetMain';
    if (ten.includes('xe đưa đón khách')) return 'https://th.bing.com/th/id/R.e6abef4f975a33a350b55c4b81176466?rik=wPENk0iummvS7A&pid=ImgRaw&r=0';
    if (ten.includes('thiệp cưới')) return 'https://kalina.com.vn/wp-content/uploads/2022/04/nhung-mau-thiep-cuoi-dep-khong-the-bo-qua-trong-ngay-cuoi-25.jpg';
    if (ten.includes('hộp quà cưới')) return 'https://tse3.mm.bing.net/th/id/OIP.4-Lx4G02W-_dZbPUFQcxqgHaHa?rs=1&pid=ImgDetMain';
    if (ten.includes('bánh cưới')) return 'https://product.hstatic.net/200000449489/product/i19__16__a49594884474402cae57254df15b50ee_master.jpg';
    if (ten.includes('rượu vang')) return 'https://vuanhabep.com.vn/wp-content/uploads/2022/07/ly-ruou-cuoi-1.jpg';
    if (ten.includes('bảo vệ')) return 'https://th.bing.com/th/id/OIP.SE6YLJpAN5o_asn62rKwxwHaE8?w=290&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3';
    if (ten.includes('y tế')) return 'https://th.bing.com/th/id/OIP.1XRMBkS2H0HoS5lK_o0Q2gHaEK?w=295&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3';
    return '/images/service-default.jpg';
}
export default function Service() {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const [openAddServiceDialog, setOpenAddServiceDialog] = useState<boolean>(false);
    const [openEditServiceDialog, setOpenEditServiceDialog] = useState<boolean>(false);
    const [serviceToEdit, setServiceToEdit] = useState<ServiceType | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [selectedService, setSelectedService] = useState<IService | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<ServiceType | null>(null);
    const [searchKey, setSearchKey] = useState("");
    const categories = ['Tất cả', 'Trang Trí', 'MC & Ca Sĩ', 'Quay Chụp', 'Làm Đẹp', 'Trang Phục', 'Phương Tiện', 'Thiệp & Quà', 'Bánh & Rượu', 'An Ninh'];
    const [services, setServices] = useState<ServiceType[]>([]);
    const handleServiceClick = (service: IService) => {
        setSelectedService(service);
        setDetailDialogOpen(true);
    };

    const handleCloseDetailDialog = () => {
        setDetailDialogOpen(false);
        setSelectedService(null);
    };

    useEffect(() => {
        fetch('http://localhost:3000/api/dichvu')
            .then(res => res.json())
            .then(data => {
                // Map lại dữ liệu từ backend sang đúng format FE cần
                const mapped = data.map((item: any) => ({
                    _id: item._id,
                    name: item.TENDICHVU,
                    description: item.GHICHU,
                    price: item.DONGIA,
                    category: item.DANHMUC,
                    image: getServiceImage(item.TENDICHVU),
                }));
                setServices(mapped);
            });
    }, []);
    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'Tất cả' || service.category === selectedCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchKey.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleOpenAddServiceDialog = () => {
        setOpenAddServiceDialog(true);
    };
    const handleAddService = (data: any) => {
        fetch('http://localhost:3000/api/dichvu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                TENDICHVU: data.name,
                GHICHU: data.description,
                DONGIA: data.price,
                DANHMUC: data.category,
            }),
        })
            .then(res => res.json())
            .then(newService => {
                setServices(prev => [
                    ...prev,
                    {
                        _id: newService._id,
                        name: newService.TENDICHVU,
                        description: newService.GHICHU,
                        price: newService.DONGIA,
                        category: newService.DANHMUC,
                    }
                ]);
                setOpenAddServiceDialog(false);
            })
    };
    const handleCloseAddServiceDialog = () => {
        setOpenAddServiceDialog(false);
    };
    const handleEditService = (updatedService: ServiceType) => {
        fetch(`http://localhost:3000/api/dichvu/${updatedService._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                TENDICHVU: updatedService.name,
                GHICHU: updatedService.description,
                DONGIA: updatedService.price,
                DANHMUC: updatedService.category,
            }),
        })
            .then(res => res.json())
            .then(newService => setServices(prev =>
                prev.map(s => s._id === updatedService._id
                    ? {
                        _id: updatedService._id,
                        name: newService.TENDICHVU,
                        description: newService.GHICHU,
                        price: newService.DONGIA,
                        category: newService.DANHMUC,
                        image: getServiceImage(newService.TENDICHVU)
                    }
                    : s
                )
            ));
        setOpenEditServiceDialog(false);
        setServiceToEdit(null);
    };
    const handleEditClick = (service: ServiceType) => {
        setServiceToEdit(service);
        setOpenEditServiceDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditServiceDialog(false);
        setServiceToEdit(null);
    };

    const handleDeleteClick = (service: ServiceType) => {
        setServiceToDelete(service);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setServiceToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (!serviceToDelete) return;
        fetch(`http://localhost:3000/api/dichvu/${serviceToDelete._id}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (res.ok) setServices(prev => prev.filter(s => s._id !== serviceToDelete._id));
                setOpenDeleteDialog(false);
                setServiceToDelete(null);
            });
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
                                    onClick={handleOpenAddServiceDialog}
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
                            {filteredServices.map((service: ServiceType) => (
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
                                                    handleDeleteClick(service);
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
                            onClose={handleCloseAddServiceDialog}
                            onSave={handleAddService} // <-- truyền hàm này vào đây
                            categories={categories}
                        />
                        <ServiceEditDialog
                            open={openEditServiceDialog}
                            onClose={handleCloseEditDialog}
                            service={serviceToEdit}
                            categories={categories}
                            onSave={handleEditService}
                        />
                        <ConfirmDelete
                            open={openDeleteDialog}
                            onClose={handleCloseDeleteDialog}
                            onConfirm={handleConfirmDelete}
                        />
                        {selectedService && (
                            <ServiceDetailMenu
                                open={detailDialogOpen}
                                onClose={handleCloseDetailDialog}
                                initialData={selectedService}
                            />
                        )}
                    </div>
                </Box>
            </Box>
        </Box>
    );
}

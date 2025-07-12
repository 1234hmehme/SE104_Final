import { Box, Card, CardContent, CardMedia, IconButton, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import { CircleDollarSign } from "lucide-react";
import { Close } from "@mui/icons-material";
import { IService, IServiceBooking } from "../../../interfaces/service.interface";
import ServiceDetailMenu from "../../../components/Menu/ServiceDetailMenu";

// Hàm gán ảnh theo tên dịch vụ (dùng link thực)
function getServiceImage(name: string) {
    const ten = name.toLowerCase();
    if (ten.includes("trang trí sảnh")) return "https://nhahanghuonglieusunflower.com/wp-content/uploads/2023/06/Trang-tri-sanh-tiec-cuoi-1.jpg";
    if (ten.includes("trang trí bàn")) return "https://cdn.tgdd.vn/2021/12/CookDishThumb/cach-trang-tri-ban-tiec-ngot-doc-dao-moi-la-ap-dung-duoc-cho-thumb-620x620.jpg";
    if (ten.includes("trang trí lễ đường")) return "https://tse1.mm.bing.net/th/id/OIP.-puz0hvMSoSpr8ow03r1RwEyDM?rs=1&pid=ImgDetMain";
    if (ten.includes("mc")) return "https://webdamcuoi.com/wp-content/uploads/2022/01/mc-dam-cuoi-1024x570.jpg";
    if (ten.includes("ca sĩ")) return "https://tse2.mm.bing.net/th/id/OIP.RJBQRtjbja59537YUUsmegHaE7?rs=1&pid=ImgDetMain";
    if (ten.includes("ban nhạc")) return "https://tse3.mm.bing.net/th/id/OIP.kM2F15lLcH9e4RdqCzMDnwHaE7?rs=1&pid=ImgDetMain";
    if (ten.includes("quay phim")) return "https://tse4.mm.bing.net/th/id/OIP.gx2kWyON409-DaK5YOpORAHaEi?rs=1&pid=ImgDetMain";
    if (ten.includes("chụp ảnh")) return "https://toplist.vn/images/800px/ah-studio-692689.jpg";
    if (ten.includes("trang điểm")) return "https://th.bing.com/th/id/R.1b26497fc5b8d280cef2e540e1f58639?rik=NcCaAEts4QRg0Q&pid=ImgRaw&r=0";
    if (ten.includes("làm tóc")) return "https://erocante.vn/wp-content/uploads/2021/01/kieu-toc-cho-co-dau-mat-dai.jpg";
    if (ten.includes("áo dài")) return "https://th.bing.com/th/id/R.e1c951e3746adb79924709cf649c2f39?rik=xKA8HSRnShOAZg&pid=ImgRaw&r=0";
    if (ten.includes("vest")) return "https://th.bing.com/th/id/R.d5124a32bd990d59da2ad88db0d581dc?rik=0R8AcCkW8Ypwww&pid=ImgRaw&r=0";
    if (ten.includes("xe hoa")) return "https://tse3.mm.bing.net/th/id/OIP.YwPx-ViAOArJbQ6sXgoIBwHaEo?rs=1&pid=ImgDetMain";
    if (ten.includes("xe đưa đón")) return "https://th.bing.com/th/id/R.e6abef4f975a33a350b55c4b81176466?rik=wPENk0iummvS7A&pid=ImgRaw&r=0";
    if (ten.includes("thiệp cưới")) return "https://kalina.com.vn/wp-content/uploads/2022/04/nhung-mau-thiep-cuoi-dep-khong-the-bo-qua-trong-ngay-cuoi-25.jpg";
    if (ten.includes("hộp quà")) return "https://tse3.mm.bing.net/th/id/OIP.4-Lx4G02W-_dZbPUFQcxqgHaHa?rs=1&pid=ImgDetMain";
    if (ten.includes("bánh cưới")) return "https://product.hstatic.net/200000449489/product/i19__16__a49594884474402cae57254df15b50ee_master.jpg";
    if (ten.includes("rượu vang")) return "https://vuanhabep.com.vn/wp-content/uploads/2022/07/ly-ruou-cuoi-1.jpg";
    if (ten.includes("bảo vệ")) return "https://th.bing.com/th/id/OIP.SE6YLJpAN5o_asn62rKwxwHaE8?w=290&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";
    if (ten.includes("y tế")) return "https://th.bing.com/th/id/OIP.1XRMBkS2H0HoS5lK_o0Q2gHaEK?w=295&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";
    return "https://via.placeholder.com/400x220?text=No+Image";
}

const NullService: IService = {
    _id: '',
    name: "",
    description: "",
    price: 0,
    image: "",
    category: ""
}

export default function StepService() {
    const { watch, setValue } = useFormContext();
    const [searchKey, setSearchKey] = useState("");
    const [serviceDetail, setServiceDetail] = useState(NullService);
    const [isDetailMenuOpen, setIsDetailMenuOpen] = useState(false);
    const [selectedServices, setSelectedServices] = useState<IServiceBooking[]>(watch("services") || []);
    const [services, setServices] = useState<IService[]>([]);

    // Lấy danh sách dịch vụ từ backend và gán ảnh minh họa bằng link thực
    useEffect(() => {
        fetch("http://localhost:3000/api/dichvu")
            .then(res => res.json())
            .then(data => setServices(data.map((item: any) => ({
                _id: item._id,
                name: item.TENDICHVU,
                description: item.GHICHU,
                price: item.DONGIA,
                image: getServiceImage(item.TENDICHVU),
                category: item.DANHMUC
            }))));
    }, []);

    useEffect(() => {
        setValue("services", selectedServices);
    }, [selectedServices]);

    const totalServicesPrice = selectedServices.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    const filteredServices = services.filter((service) => {
        return service.name.toLowerCase().includes(searchKey.toLowerCase());
    });

    const handleSelectService = (service: IService) => {
        setSelectedServices((prev) => {
            if (prev.some(item => item.serviceId === service._id)) return prev;
            return [...prev, {
                ...service,
                serviceId: service._id,
                quantity: 1,
                note: "",
            }];
        });
    };

    const handleDeleteService = (deleteId: string) => {
        const updatedServices = selectedServices.filter(s => s.serviceId !== deleteId);
        setSelectedServices(updatedServices);
    };

    const handleChangeNote = (serviceId: string, note: string) => {
        setSelectedServices((prev) =>
            prev.map(item =>
                item.serviceId === serviceId ? { ...item, note } : item
            )
        );
    };

    const handleChangeQuantity = (serviceId: string, quantity: number) => {
        setSelectedServices((prev) =>
            prev.map(item =>
                item.serviceId === serviceId ? { ...item, quantity } : item
            )
        );
    };

    return (
        <Box sx={{
            display: 'flex', gap: '20px', height: '100%'
        }}>
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
                    padding: '3px',
                }}>
                    {filteredServices.map((service) => (
                        <Card
                            key={service._id}
                            onClick={() => { handleSelectService(service) }}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                cursor: "pointer",
                                border:
                                    selectedServices.some(s => s.serviceId === service._id)
                                        ? "3px solid #4880FF"
                                        : "1px solid #ccc",
                                boxShadow: selectedServices.some(s => s.serviceId === service._id) ? 4 : 1,
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={service.image}
                                sx={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    height: 200,
                                }}
                            />
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                gap: '10px',
                                flexGrow: 1
                            }}>
                                <Typography
                                    onClick={() => {
                                        setServiceDetail(service);
                                        setIsDetailMenuOpen(true);
                                    }}
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        '&:hover': {
                                            color: '#4880FF',
                                        },
                                    }}
                                >
                                    {service.name}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', }}>
                                    <Typography sx={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        overflow: 'hidden',
                                        WebkitLineClamp: 2,
                                        color: 'GrayText',
                                        fontSize: '14px',
                                        height: '45px',
                                    }}>
                                        {service.description}
                                    </Typography>

                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}>
                                        <CircleDollarSign size="18px" />
                                        <Typography color="text.secondary" fontSize={14}>
                                            {service.price.toLocaleString('vi-VN')} VND
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>

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
                <Typography sx={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                }}>Dịch vụ đã chọn</Typography>

                <Box sx={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    gap: '7px',
                    padding: '2px',
                    overflowY: 'auto',
                    pr: 1,
                }}>
                    {selectedServices.map((item) => (
                        <Box
                            key={item.serviceId}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderRadius: 3,
                                boxShadow: 3
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                padding: '15px 20px',
                            }}>
                                <Typography sx={{
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                }}>
                                    {item.name}
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}>
                                    <Typography sx={{
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                    }}>
                                        Số lượng:
                                    </Typography>

                                    <TextField
                                        value={item.quantity}
                                        onChange={(e) => handleChangeQuantity(item.serviceId, Number(e.target.value))}
                                        type="number"
                                        defaultValue={1}
                                        inputProps={{ min: 1 }}
                                        sx={{
                                            width: '70px',
                                            "& fieldset": {
                                                borderRadius: "10px",
                                            },
                                            "& .MuiInputBase-input": {
                                                padding: "8px 10px",
                                            },
                                        }}
                                    />
                                </Box>

                                <TextField
                                    value={item.note}
                                    onChange={(e) => handleChangeNote(item.serviceId, e.target.value)}
                                    placeholder="Ghi chú"
                                    multiline
                                    minRows={1}
                                    variant="standard"
                                />
                            </Box>
                            <IconButton
                                sx={{ height: 'fit-content' }}
                                onClick={() => { handleDeleteService(item.serviceId) }}
                            >
                                <Close sx={{ fontSize: '20px' }} />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    marginBottom: '7px',
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                        }}>
                            Tổng tiền dịch vụ:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: 'green',
                        }}>
                            {totalServicesPrice.toLocaleString('vi-VN')} VND
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <ServiceDetailMenu
                open={isDetailMenuOpen}
                onClose={() => setIsDetailMenuOpen(false)}
                initialData={serviceDetail}
            />
        </Box>
    );
}
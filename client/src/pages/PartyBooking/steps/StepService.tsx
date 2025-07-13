import { Box, Card, CardContent, CardMedia, IconButton, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import { CircleDollarSign } from "lucide-react";
import { Close } from "@mui/icons-material";
import { IService, IServiceBooking } from "../../../interfaces/service.interface";
import ServiceDetailMenu from "../../../components/Menu/ServiceDetailMenu";

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

    useEffect(() => {
        fetch("http://localhost:3000/api/dichvu")
            .then(res => res.json())
            .then(data => setServices(data.map((item: any) => ({
                _id: item._id,
                name: item.TENDICHVU,
                description: item.GHICHU,
                price: item.DONGIA,
                image: item.HINHANH,
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
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            if (val >= 1) {
                                                handleChangeQuantity(item.serviceId, val)
                                            }
                                        }}
                                        type="number"
                                        defaultValue={1}
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
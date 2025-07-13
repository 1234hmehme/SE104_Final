import { Box, Card, CardContent, CardMedia, IconButton, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { defaultBgColorMap, defaultTextColorMap } from "../../../assets/color/ColorMap";
import { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import { CircleDollarSign } from "lucide-react";
import { IFood, IFoodBooking } from "../../../interfaces/food.interface";
import { Close } from "@mui/icons-material";
import FoodDetailMenu from "../../../components/Menu/FoodDetailMenu";

const NullFood = {
    _id: '',
    name: "",
    description: "",
    price: 0,
    image: "",
    category: ""
};

export default function StepFood() {
    const { watch, setValue, formState: { errors } } = useFormContext();
    const [searchKey, setSearchKey] = useState("");
    const [foodDetail, setFoodDetail] = useState(NullFood);
    const [isDetailMenuOpen, setIsDetailMenuOpen] = useState(false);
    const [selectedFoods, setSelectedFoods] = useState<IFoodBooking[]>(watch("foods") || []);
    const [foods, setFoods] = useState<IFood[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/monan")
            .then(res => res.json())
            .then(data => setFoods(data.map((item: any) => ({
                _id: item._id,
                name: item.TENMONAN,
                description: item.GHICHU,
                price: item.DONGIA,
                image: item.HINHANH,
                category: item.LOAI
            }))));
    }, []);

    useEffect(() => {
        setValue("foods", selectedFoods);
    }, [selectedFoods]);

    const minTablePrice = watch("hall")?.minTablePrice || 0;
    const tablePrice = selectedFoods.reduce((sum, item) => sum + item.price, 0);
    const totalTables = (watch("tables") || 0) + (watch("reserveTables") || 0);

    const filteredFoods = foods.filter((food) => {
        return food.name.toLowerCase().includes(searchKey.toLowerCase());
    });

    const handleSelectFood = (food: IFood) => {
        setSelectedFoods((prev) => {
            if (prev.some(item => item.foodId === food._id)) return prev;
            return [...prev, {
                ...food,
                foodId: food._id,
                note: ""
            }];
        });
    };

    const handleDeleteFood = (deleteId: string) => {
        const updatedFoods = selectedFoods.filter(f => f.foodId !== deleteId);
        setSelectedFoods(updatedFoods);
    };

    const handleChangeNote = (foodId: string, note: string) => {
        setSelectedFoods((prev) =>
            prev.map(item =>
                item.foodId === foodId ? { ...item, note } : item
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
                    {filteredFoods.map((food) => (
                        <Card
                            key={food._id}
                            onClick={() => { handleSelectFood(food) }}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                cursor: "pointer",
                                border:
                                    selectedFoods.some(f => f.foodId === food._id)
                                        ? "3px solid #4880FF"
                                        : "1px solid #ccc",
                                boxShadow: selectedFoods.some(f => f.foodId === food._id) ? 4 : 1,
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={food.image}
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
                                        setFoodDetail(food);
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
                                    {food.name}
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
                                        {food.description}
                                    </Typography>

                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}>
                                        <CircleDollarSign size="18px" />
                                        <Typography color="text.secondary" fontSize={14}>
                                            {food.price.toLocaleString('vi-VN')} VND
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        width: 'auto',
                                        height: '30px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 2,
                                        backgroundColor: defaultBgColorMap[food.category],
                                        color: defaultTextColorMap[food.category],
                                        fontWeight: 'bold',
                                    }}>
                                        {food.category}
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
                gap: '10px',
                padding: '2px'
            }}>
                <SearchBar
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                />
                <Typography sx={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                }}>Món đã chọn</Typography>

                <Box sx={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    gap: '7px',
                    padding: '2px',
                    overflowY: 'auto',
                    pr: 1,
                }}>
                    {selectedFoods.map((item) => (
                        <Box
                            key={item.foodId}
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
                                    width: 'fit-content',
                                    padding: '4px 6px',
                                    borderRadius: 2,
                                    backgroundColor: defaultBgColorMap[item.category],
                                    color: defaultTextColorMap[item.category],
                                    fontWeight: 'bold',
                                }}>
                                    {item.category}
                                </Box>

                                <TextField
                                    value={item.note}
                                    onChange={(e) => handleChangeNote(item.foodId, e.target.value)}
                                    placeholder="Ghi chú"
                                    multiline
                                    variant="standard"
                                />

                            </Box>

                            <IconButton
                                sx={{ height: 'fit-content' }}
                                onClick={() => { handleDeleteFood(item.foodId) }}
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
                    paddingY: '7px',
                }}>

                    {errors.foods && (
                        <Typography color="error" fontSize="18px">
                            {errors.foods.message}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                        }}>
                            Đơn giá bàn tối thiểu:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: 'green',
                        }}>
                            {minTablePrice.toLocaleString('vi-VN')} VND
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                        }}>
                            Đơn giá bàn:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: tablePrice >= minTablePrice ? 'green' : 'red',
                        }}>
                            {tablePrice.toLocaleString('vi-VN')} VND
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                        }}>
                            Tổng tiền bàn:
                        </Typography>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: 'green',
                        }}>
                            {(tablePrice * totalTables).toLocaleString('vi-VN')} VND
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <FoodDetailMenu
                open={isDetailMenuOpen}
                onClose={() => setIsDetailMenuOpen(false)}
                initialData={foodDetail}
            />
        </Box>
    );
}
import { useState, useEffect } from 'react';
import './Food.css';
import { Button, Box, Typography, Snackbar, Alert, } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import FoodAddDialog from './FoodAddDialog.tsx';
import ConfirmDelete from '../../components/Alert/ConfirmDelete.tsx';
import EditIcon from '@mui/icons-material/Edit';
import FoodEditDialog from './FoodEditDialog.tsx';
import PetalAnimation from '../../components/Animations/PetalAnimation';
import FoodDetailMenu from '../../components/Menu/FoodDetailMenu';
import SearchBar from '../../components/SearchBar';
import { RoleBasedRender } from '../../components/RoleBasedRender.tsx';
import { IFood } from '../../interfaces/food.interface.ts';
import monanApi from '../../apis/monanApis.ts';

export default function Food() {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const categories = ['Tất cả', 'Món Khai Vị', 'Món Chính', 'Món Tráng Miệng'];
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState<IFood | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [foodToDelete, setFoodToDelete] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [foodToEdit, setFoodToEdit] = useState<IFood | null>(null);
    const [foods, setFoods] = useState<IFood[]>([]);
    const [searchKey, setSearchKey] = useState("");

    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const fetchFoods = async () => {
        try {
            const data = await monanApi.getAll();

            const mapped = data.map((item: any) => ({
                id: item._id,
                _id: item._id,
                name: item.TENMONAN,
                description: item.GHICHU,
                price: item.DONGIA,
                category: item.LOAI,
                image: item.HINHANH,
            }));

            setFoods(mapped);
        } catch (err) {
            console.error("Lỗi khi fetch món ăn:", err);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    useEffect(() => {
        if (openSnackbar) {
            const timer = setTimeout(() => setOpenSnackbar(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [openSnackbar]);

    const filteredFoods = foods.filter(food => {
        const matchesCategory = selectedCategory === 'Tất cả' || food.category === selectedCategory;
        const matchesSearch = food.name.toLowerCase().includes(searchKey.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSuccess = async (message: string) => {
        await fetchFoods();
        setSuccessMessage(message);
        setOpenSnackbar(true);
    };

    const handleFail = async (message: string) => {
        setSuccessMessage(message);
        setOpenSnackbar(true);
    }

    const handleDeleteClick = (_id: string) => {
        setFoodToDelete(_id);
        setDeleteDialogOpen(true);
    };

    const handleEditClick = (food: IFood) => {
        setFoodToEdit(food);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setFoodToEdit(null);
    };

    const handleFoodClick = (food: IFood) => {
        setSelectedFood(food);
        setDetailDialogOpen(true);
    };

    return (
        <Box sx={{ background: '#f5f6fa', minHeight: '100vh', p: 0, position: 'relative', overflow: 'hidden' }}>

            <Box sx={{ background: '#fff', borderRadius: 3, p: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.04)', maxWidth: 1400, mx: 'auto', width: '100%', position: 'relative', zIndex: 1 }}>
                <Box sx={{ height: '100vh', overflowY: 'auto', pr: 2 }}>
                    <div className="food-container">
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
                            Danh Sách Món Ăn
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
                                    onClick={() => setAddDialogOpen(true)}
                                >
                                    Thêm món ăn
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

                        <div className="food-grid" style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 24,
                            justifyContent: 'flex-start',


                        }}>
                            {filteredFoods.map((food) => (
                                <div key={food._id} className="food-card" style={{
                                    flex: '0 1 calc(25% - 18px)',
                                    minWidth: '240px',
                                    maxWidth: '1fr',
                                    position: 'relative',
                                    cursor: 'pointer',
                                }}
                                    onClick={() => handleFoodClick(food)}
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
                                                    handleEditClick(food);
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
                                                    handleDeleteClick(food._id);
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
                                                    <DeleteOutline fontSize="small" sx={{ color: '#ff0000', opacity: 0.85, transition: 'opacity 0.2s' }} />
                                                </Box>
                                            </Button>
                                        </div>
                                    </RoleBasedRender>

                                    <img src={food.image} alt={food.name} className="food-image" />
                                    <div className="food-info">
                                        <h3>{food.name}</h3>
                                        <p>{food.description}</p>
                                        <p className="food-price">{food.price.toLocaleString('vi-VN')} VNĐ</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <FoodAddDialog
                            open={addDialogOpen}
                            onClose={() => setAddDialogOpen(false)}
                            onSuccess={handleSuccess}
                            onFail={handleFail}
                            categories={categories}
                        />
                        <ConfirmDelete
                            open={deleteDialogOpen}
                            onClose={() => setDeleteDialogOpen(false)}
                            onConfirm={async () => {
                                if (!foodToDelete) return;

                                try {
                                    await monanApi.delete(foodToDelete);
                                    handleSuccess("Xóa món ăn thành công");
                                } catch (err) {
                                    console.error("Lỗi khi xóa:", err);
                                    handleFail("Xóa món thất bại");
                                } finally {
                                    setDeleteDialogOpen(false);
                                    setFoodToDelete(null);
                                }
                            }}
                        />

                        <FoodEditDialog
                            open={editDialogOpen}
                            onClose={handleCloseEditDialog}
                            food={foodToEdit}
                            categories={categories}
                            onSuccess={handleSuccess}
                            onFail={handleFail}
                        />

                        {selectedFood && (
                            <FoodDetailMenu
                                open={detailDialogOpen}
                                onClose={() => setDetailDialogOpen(false)}
                                initialData={selectedFood}
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

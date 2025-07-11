export interface IFood {
    _id: string; // Thêm dòng này
    id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
};

export interface IFoodBooking {
    foodId: string;
    name: string;
    price: number;
    category: string;
    note: string;
};
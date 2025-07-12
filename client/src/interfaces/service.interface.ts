export interface IService {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
};

export interface IServiceBooking {
    serviceId: string;
    name: string;
    price: number;
    quantity: number;
    note: string;
}
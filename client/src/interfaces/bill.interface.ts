export interface IBill {
    id: string;
    groom: string;
    bride: string;
    tableTotalPrice: number;
    serviceTotalPrice: number;
    date: string;
    paymentAmount: number;
    penalty: number;
    type: string;
}
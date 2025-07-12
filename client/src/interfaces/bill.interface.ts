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

export interface IBillDetail {
    id: string;
    NGAYTHANHTOAN: string;
    SOTIENHOADON: number;
    TIENPHAT: number;
    TIENBAN: number;
    TIENDICHVU: number;
    LOAIHOADON: "Đặt cọc" | "Thanh toán";

    CHURE: string;
    CODAU: string;
    SOLUONGBAN: number;
    SOBANDT: number;
    NGAYDAI: string;

    monAn: {
        _id: string;
        TENMONAN: string;
        LOAI: string;
        GIATIEN: number;
        GHICHU?: string;
    }[];

    dichVu: {
        _id: string;
        TENDICHVU: string;
        GIATIEN: number;
        SOLUONG: number;
    }[];
}
export interface IMonthlyReportDetail {
  Ngay: Date;           // ngày trong tháng
  SoLuongTieccuoi: number;    // số lượng tiệc
  DoanhThu: number;       // doanh thu
}

export interface IMonthlyReport {
  DOANHTHU: number;
  ctbcTrongThang: IMonthlyReportDetail[]
}
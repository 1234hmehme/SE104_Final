import { useState, useEffect, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Box, FormControl, MenuItem, Paper, Select, Typography } from "@mui/material";
import dayjs from "dayjs";
import { IMonthlyReportDetail, IMonthlyReport } from "../../interfaces/report.interface";
import baocaoApi from "../../apis/baocaoApis";

const NullMonthlyReport = {
  DOANHTHU: 0,
  ctbcTrongThang: []
}

export default function RevenueReport() {
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const currentYear = dayjs().year();
  const [fetchData, setFetchData] = useState<IMonthlyReport>(NullMonthlyReport);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await baocaoApi.getByThang(selectedMonth, selectedYear);

        const mapped = {
          DOANHTHU: data.DOANHTHU,
          ctbcTrongThang: data.ctbcTrongThang,
        };

        setFetchData(mapped);
      } catch (err) {
        console.error("Load report lỗi:", err);
      }
    }

    loadReport();
  }, [selectedMonth, selectedYear]);

  const totalEvent = useMemo(
    () => fetchData?.ctbcTrongThang.reduce((sum, d) => sum + d.SoLuongTieccuoi, 0),
    [fetchData]
  );

  const totalRevenue = fetchData.DOANHTHU;

  const fullMonth = Array.from({ length: dayjs(`${selectedYear}-${selectedMonth}-01`).daysInMonth() }, (_, i) => i + 1);

  const chartData = useMemo(() => {
    const dataByDay = new Map(fetchData.ctbcTrongThang.map(d => [dayjs(d.Ngay).date(), d]));

    return fullMonth.map(day => {
      const d = dataByDay.get(day);
      return {
        Ngay: day,
        SoLuongTieccuoi: d?.SoLuongTieccuoi || 0,
        DoanhThu: d?.DoanhThu || 0,
        percent: ((d?.DoanhThu || 0) / (totalRevenue || 1) * 100).toFixed(2),
      };
    });
  }, [fetchData, selectedMonth, selectedYear, totalRevenue]);

  const options = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any[]) => {
        const idx = params[0].dataIndex;
        const data = chartData[idx];
        return `
          Ngày ${data.Ngay}/${selectedMonth}/${selectedYear}<br/>
          Số tiệc: ${data.SoLuongTieccuoi}<br/>
          Doanh thu: ${data.DoanhThu.toLocaleString()} VND<br/>
          Tỉ lệ: ${data.percent}%
        `;
      },
    },
    legend: {
      data: ["Số tiệc", "Doanh thu"],
      top: "bottom",
      textStyle: { fontSize: 16 },
    },
    grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
    xAxis: {
      type: "category",
      data: chartData.map((d) => d.Ngay),
    },
    yAxis: [
      { type: "value", name: "Số tiệc", position: "left" },
      {
        type: "value",
        name: "Doanh thu",
        position: "right",
        axisLabel: { formatter: (v: number) => `${v / 1e6}tr` },
        splitLine: { lineStyle: { type: "dashed" } },
      },
    ],
    series: [
      {
        name: "Số tiệc",
        type: "bar",
        data: chartData.map((d) => d.SoLuongTieccuoi),
        barWidth: "60%",
        itemStyle: { borderRadius: [8, 8, 0, 0] },
      },
      {
        name: "Doanh thu",
        type: "line",
        yAxisIndex: 1,
        data: chartData.map((d) => d.DoanhThu),
        lineStyle: { color: "#FF9800" },
        itemStyle: { color: "#FF9800" },
      },
    ],
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: '100%',
        p: "30px 5px",
        borderRadius: "15px",
      }}
    >
      {/* Header chọn tháng/năm */}
      <Box sx={{ display: "flex", px: 3, mb: 2, justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
          Biểu đồ doanh thu
        </Typography>
        <FormControl sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Typography sx={{ fontWeight: "bold" }}>Tháng:</Typography>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {[...Array(12)].map((_, i) => {
              const m = 12 - i;
              return (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              );
            })}
          </Select>
          <Typography sx={{ fontWeight: "bold" }}>Năm:</Typography>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[...Array(currentYear - 2023 + 1)].map((_, i) => {
              const y = currentYear - i;
              return (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      {/* Tổng số tiệc & doanh thu */}
      <Box sx={{ display: "flex", gap: 4, mb: 2, justifyContent: "center" }}>
        <Typography sx={{ fontWeight: "bold" }}>
          Tổng số tiệc: {totalEvent}
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Tổng doanh thu: {totalRevenue.toLocaleString()} VND
        </Typography>
      </Box>

      {/* Biểu đồ */}
      {chartData.every(d => d.DoanhThu === 0 && d.SoLuongTieccuoi === 0) ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: "gray",
          flex: 1,
          marginBottom: 10
        }}>
          Không có dữ liệu trong tháng này
        </Box>
      ) : (
        <ReactECharts option={options} style={{ height: 500 }} />
      )}
    </Paper>
  );
}

import { useState, useEffect, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Box, FormControl, MenuItem, Paper, Select, Typography } from "@mui/material";
import dayjs from "dayjs";
import { IMonthlyReport } from "../../interfaces/report.interface";

export default function RevenueReport() {
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const currentYear = dayjs().year();
  const [fetchData, setFetchData] = useState<IMonthlyReport[]>([]);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch("http://localhost:3000/api/hoadon");
        const raw: any[] = await res.json();

        const filtered = raw.filter((item) => {
          const d = dayjs(item.NGAYTHANHTOAN);
          return d.month() + 1 === selectedMonth && d.year() === selectedYear;
        });

        const groups: Record<number, { eventCount: number; revenue: number }> = {};
        filtered.forEach((item) => {
          const day = dayjs(item.NGAYTHANHTOAN).date();
          if (!groups[day]) groups[day] = { eventCount: 0, revenue: 0 };
          groups[day].eventCount += 1;
          groups[day].revenue += item.TONGTIEN;
        });

        const daysInMonth = dayjs(`${selectedYear}-${selectedMonth}-01`).daysInMonth();
        const reportArr: IMonthlyReport[] = Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const g = groups[d] || { eventCount: 0, revenue: 0 };
          return { day: d, eventCount: g.eventCount, revenue: g.revenue };
        });

        setFetchData(reportArr);
      } catch (err) {
        console.error("Load report lỗi:", err);
      }
    }

    loadReport();
  }, [selectedMonth, selectedYear]);

  const totalEvent = useMemo(
    () => fetchData.reduce((sum, d) => sum + d.eventCount, 0),
    [fetchData]
  );

  const totalRevenue = useMemo(
    () => fetchData.reduce((sum, d) => sum + d.revenue, 0),
    [fetchData]
  );

  const chartData = useMemo(
    () =>
      fetchData.map((d) => ({
        ...d,
        percent: ((d.revenue / (totalRevenue || 1)) * 100).toFixed(2),
      })),
    [fetchData, totalRevenue]
  );

  const options = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any[]) => {
        const idx = params[0].dataIndex;
        const data = chartData[idx];
        return `
          Ngày ${data.day}/${selectedMonth}/${selectedYear}<br/>
          Số tiệc: ${data.eventCount}<br/>
          Doanh thu: ${data.revenue.toLocaleString()} VND<br/>
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
      data: chartData.map((d) => d.day),
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
        data: chartData.map((d) => d.eventCount),
        barWidth: "60%",
        itemStyle: { borderRadius: [8, 8, 0, 0] },
      },
      {
        name: "Doanh thu",
        type: "line",
        yAxisIndex: 1,
        data: chartData.map((d) => d.revenue),
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
      <ReactECharts option={options} style={{ height: 500 }} />
    </Paper>
  );
}

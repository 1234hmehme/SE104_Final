import { useEffect, useState } from "react";
import { Box, Typography, IconButton, ToggleButtonGroup, ToggleButton, Popover, Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IParty } from "../../interfaces/party.interface";
import PartyForm from "../../components/Form/PartyForm";
import WeeklySchedule from "./WeeklySchedule";
import MonthlySchedule from "./MonthlySchedule";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ScheduleForm from "../../components/Form/ScheduleForm";

export default function Schedule() {
  const { view } = useParams<{ view: 'tuan' | 'thang' }>();
  const navigate = useNavigate();


  const [initialData, setInitialData] = useState<IParty[]>([]);
  // 1. State mới để giữ danh sách halls:
  const [halls, setHalls] = useState<{ _id: string; LOAISANH: string }[]>([]);

  // 2. Khi component mount, fetch cả hai cùng lúc:
  useEffect(() => {
    async function loadAll() {
      // fetch}sanh và tieccuoi song song
      const [hRes, pRes] = await Promise.all([
        fetch("http://localhost:3000/api/sanh"),
        fetch("http://localhost:3000/api/tieccuoi"),
      ]);
      const hallsJson = await hRes.json() as any[];           // mỗi phần tử có _id, LOAISANH, TENSANH…
      const partiesJson = await pRes.json() as any[];           // phần tiệc cưới

      const filtered = partiesJson.filter(item => item.TRANGTHAI !== 'Đã huỷ');


      setHalls(hallsJson);

      // 3. Map partiesJson thành IParty, ánh xạ MASANH -> LOAISANH
      const mapped: IParty[] = filtered.map(item => {
        // tìm hall doc có _id === item.MASANH
        const hallDoc = hallsJson.find(h => h._id === item.MASANH);
        return {
          code: item.code,
          id: item._id,
          groom: item.TENCR,
          bride: item.TENCD,
          phone: item.SDT,
          date: item.NGAYDAI,
          shift: item.CA,
          // gán hall bằng TENSANH, hoặc fallback về chính item.MASANH nếu không tìm thấy
          hall: hallDoc?.TENSANH ?? item.TENSANH,
          deposit: item.TIENCOC,
          tables: item.SOLUONGBAN,
          reserveTables: item.SOBANDT,
          status: item.TRANGTHAI
        };
      });

      setInitialData(mapped);
    }
    loadAll();
  }, []);


  const [viewMode, setViewMode] = useState<'tuan' | 'thang'>(view || 'tuan');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [tempDate, setTempDate] = useState(currentDate);
  const [isPartyFormOpen, setIsPartyFormOpen] = useState(false);
  const [detailData, setDetailData] = useState<IParty | null>(null);
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(new Date().toDateString());
  const [monthDatePartyList, setMonthDatePartyList] = useState<IParty[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (view === 'tuan' || view === 'thang') {
      setViewMode(view);
    }
  }, [view]);

  useEffect(() => {
    setTempDate(currentDate);
  }, [currentDate]);

  const handleChangeViewMode = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'tuan' | 'thang' | null
  ) => {
    if (newView !== null) {
      navigate(`/lich-su-kien/${newView}`);
    }
  };

  const goToPrevious = () => {
    setCurrentDate(
      viewMode === 'tuan'
        ? currentDate.subtract(1, "week")
        : currentDate.subtract(1, 'month'));
  };

  const goToNext = () => {
    setCurrentDate(
      viewMode === 'tuan'
        ? currentDate.add(1, "week")
        : currentDate.add(1, 'month'));
  };

  const handleOpenCalendar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCalendar = (save: boolean) => {
    if (save) setCurrentDate(tempDate);
    else setTempDate(currentDate);
    setAnchorEl(null)
  };

  const handleViewDetail = (party: IParty) => {
    setDetailData(party);
    setIsPartyFormOpen(true);
  };

  const handleMonthDateSeeAll = (partyList: IParty[], date: string) => {
    setMonthDatePartyList(partyList);
    setMonthDate(date);
    setIsScheduleFormOpen(true);
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: "100%",
      overflow: 'hidden',
      backgroundColor: '#fff',
      borderRadius: '15px',
      padding: '25px',
    }}>
      <Box sx={{
        height: "5%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
      }}>
        <IconButton onClick={goToPrevious}><ChevronLeft /></IconButton>
        <Typography onClick={handleOpenCalendar}
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
          {`${currentDate.endOf('week').format("MMMM")} ${currentDate.add(6, 'day').format("YYYY")}`}
        </Typography>
        <IconButton onClick={goToNext}><ChevronRight /></IconButton>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => handleCloseCalendar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            sx={{
              '& .MuiPopover-paper': {
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                gap: '5px',
              },
              '& .MuiPickersLayout-root': {
                minWidth: 0,
              },
              '& .MuiDateCalendar-root': {
                gap: '10px',
                height: 'auto',
                width: 'auto',
                margin: 0,
              },
              '& .MuiPickersCalendarHeader-root': {
                padding: '0 8px',
                margin: 0,
                justifyContent: 'space-between',
              },
              '& .MuiPickersCalendarHeader-labelContainer': {
                color: '#202224',
                fontWeight: 600,
                fontSize: '15px',
                margin: 0,
              },
              '& .MuiPickersArrowSwitcher-root': {
                gap: '5px'
              },
              '& .MuiPickersArrowSwitcher-button': {
                padding: 0,
                backgroundColor: '#e7e9ee',
                borderRadius: '5px'
              },
              '& .MuiTypography-root': {
                color: '#454545',
              },

            }}
          >
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              openTo={viewMode === 'tuan' ? 'day' : 'month'}
              views={viewMode === 'tuan' ? ['year', 'month', 'day'] : ['year', 'month']}
              value={tempDate}
              onChange={(newValue) => {
                if (newValue) setTempDate(newValue);
              }}
              slotProps={{
                actionBar: { style: { display: 'none' } },
                day: {
                  sx: {
                    color: "#8f9091",
                    borderRadius: '10px',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                    '&.MuiPickersDay-root.Mui-selected': {
                      backgroundColor: '#4880FF',
                      '&:hover': {
                        backgroundColor: '#3578f0'
                      }
                    },
                  },
                },
              }}
            />
            <Button variant="contained" onClick={() => handleCloseCalendar(true)}
              sx={{
                alignSelf: 'flex-end',
                backgroundColor: '#4880FF',
                '&:hover': {
                  backgroundColor: '#3578f0'
                }
              }}>
              Ok
            </Button>
          </Popover>
        </LocalizationProvider>

        <Box sx={{
          position: 'absolute',
          right: 0,
        }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleChangeViewMode}
            sx={{
              height: '36px',
              '& .MuiToggleButtonGroup-firstButton': {
                borderTopLeftRadius: '15px',
                borderBottomLeftRadius: '15px',
              },
              '& .MuiToggleButtonGroup-lastButton': {
                borderTopRightRadius: '15px',
                borderBottomRightRadius: '15px',
              },
              '& .MuiToggleButton-root': {
                fontSize: '14px',
                textTransform: 'none',
                '&.Mui-selected': {
                  backgroundColor: '#4880FF',
                  color: '#fff',
                  ':hover': {
                    backgroundColor: '#3578f0',
                  }
                }
              }
            }}
          >
            <ToggleButton value="tuan" sx={{ flex: 1, }}>
              Tuần
            </ToggleButton>
            <ToggleButton value="thang" sx={{ flex: 1, }}>
              Tháng
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box sx={{
        height: "90%",
      }}>
        {viewMode === 'tuan' ? (
          <WeeklySchedule
            currentWeek={currentDate}
            partyData={initialData}
            onViewPartyDetail={handleViewDetail}
          />
        ) : (
          <MonthlySchedule
            currentMonth={currentDate}
            partyData={initialData}
            onViewPartyDetail={handleViewDetail}
            onDateSeeAll={handleMonthDateSeeAll}
          />
        )}

      </Box>

      <PartyForm
        open={isPartyFormOpen}
        onClose={() => setIsPartyFormOpen(false)}
        onSubmit={() => { }}
        onExportBill={() => { }}
        initialData={detailData}
        readOnly={true}
        hallName={detailData?.hall || ""}
      />

      <ScheduleForm
        open={isScheduleFormOpen}
        onClose={() => setIsScheduleFormOpen(false)}
        initialData={monthDatePartyList}
        date={monthDate}
        onViewPartyDetail={handleViewDetail}
      />
    </Box>
  );
}
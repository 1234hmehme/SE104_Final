import { useEffect, useRef, useState } from "react";
import { Box, } from "@mui/material";
import { IParty } from "../../interfaces/party.interface";
import { defaultBgColorMap, } from "../../assets/color/ColorMap";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(isToday);

export default function MonthlySchedule({
    currentMonth,
    partyData,
    onViewPartyDetail,
    onDateSeeAll
}: {
    currentMonth: dayjs.Dayjs,
    partyData: IParty[],
    onViewPartyDetail: (party: any) => void,
    onDateSeeAll: (partyList: any, date: string) => void
}) {
    const monthStart = currentMonth.startOf("month");
    const calendarStart = monthStart.startOf('week')
    const partyListRef = useRef<HTMLDivElement>(null);
    const [maxParty, setMaxParty] = useState(2); // default

    const updateMaxParty = () => {
        const cellHeight = partyListRef.current?.offsetHeight;
        const partyHeight = 14;
        const gap = 3;

        const max = Math.floor((Number(cellHeight) + gap - 12) / (partyHeight + gap));
        setMaxParty(max);
        console.log(cellHeight);
    };

    useEffect(() => {
        updateMaxParty(); // Gọi lần đầu

        window.addEventListener('resize', updateMaxParty);

        return () => {
            window.removeEventListener('resize', updateMaxParty);
        };
    }, []);

    const getCalendarDates = () => {
        return Array.from({ length: 42 }).map((_, index) =>
            calendarStart.add(index, "day")
        );
    };

    const monthDates = getCalendarDates();

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
            overflow: 'auto',
            scrollbarWidth: 'none',
        }}>
            <Box sx={{
                position: 'sticky',
                top: 0,
                height: '40px',
                display: 'grid',
                backgroundColor: '#F1F4F9',
                fontWeight: 'bold',
                gridTemplateColumns: 'repeat(7, 1fr)',
            }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(value => (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {value}
                    </Box>
                ))}
            </Box>

            <Box sx={{
                flex: 1,
                display: 'grid',
                borderLeft: '1px solid #e0e0e0',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gridTemplateRows: 'repeat(6, 1fr)',
            }}>
                {monthDates.map((date, index) => {
                    const isCurrentMonth = date.month() === currentMonth.month();
                    const isTodayDate = date.isToday();
                    const datePartys = partyData.filter(e => dayjs(e.date).isSame(date, "day"));

                    return (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '5px 7px',
                                gap: '5px',
                                borderRight: '1px solid #e0e0e0',
                                borderBottom: '1px solid #e0e0e0',
                                backgroundColor: isCurrentMonth ? "#fff" : null,
                                backgroundImage: isCurrentMonth ? null : `repeating-linear-gradient(
                                    150deg, #5088FF,  
                                    transparent 1px,
                                    transparent 10px
                                )`,
                                overflow: 'hidden',
                                opacity: isCurrentMonth ? 1 : 0.4,
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '25px',
                                width: '25px',
                                fontWeight: 500,
                                fontSize: '14px',
                                alignSelf: 'flex-end',
                                backgroundColor: isTodayDate ? "#4880FF" : null,
                                color: isTodayDate ? "white" : "black",
                                borderRadius: '50px'
                            }}>
                                {date.date()}
                            </Box>
                            <Box
                                ref={partyListRef}
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '3px',
                                }}>
                                {datePartys.slice(0, maxParty).map(party => (
                                    <Box
                                        key={party.id}
                                        sx={{
                                            backgroundColor: defaultBgColorMap[party.shift],
                                            padding: '0px 4px',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            lineHeight: '14px',
                                        }}
                                        onClick={() => onViewPartyDetail(party)}
                                    >
                                        {party.shift} - {party.hall}
                                    </Box>
                                ))}

                                {datePartys.length > maxParty && (
                                    <Box
                                        sx={{
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            lineHeight: '12px',
                                            color: '#666666',
                                            ':hover': {
                                                backgroundColor: '#ddd'
                                            }
                                        }}
                                        onClick={() => onDateSeeAll(datePartys, date.toString())}
                                    >
                                        + {datePartys.length - maxParty}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}
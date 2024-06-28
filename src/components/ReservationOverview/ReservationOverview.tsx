import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllReservations, getReservationsByDate } from "../../store/reducers/reservationsReducer";
import { Reservation } from "../../types/reservationTypes";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { parseDate } from "../../utils/reservations/dateUtils";
import { formatHour } from "../../utils/reservations/formatHour";

const ReservationOverview: React.FC = () => {
  // State to hold the target date
  const [targetDate, setTargetDate] = useState<string>('28/06/24'); // Initial target date

  // Format date function to ensure two-digit day and month
  const formatDate = (day: number, month: number, year: number): string => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedYear = year.toString().padStart(2, '0'); // Adjust padding as needed
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };

  // Redux selector to get reservations for the target date
//   const selectReservationsTargetDate = getReservationsByDate(targetDate);
//   const resListTargetDate: Reservation[] = useSelector((state: any) =>
//     selectReservationsTargetDate(state)
//   );
    const resListTargetDate: Reservation[] = useSelector(getAllReservations);

  useEffect(() => {
    console.log('Reservations for target date:', resListTargetDate);
  }, [resListTargetDate]);

  // Function to handle date click in FullCalendar
  const handleDateClick = (clickInfo: any) => {
    const clickedDate = formatDate(clickInfo.date.getDate(), clickInfo.date.getMonth() + 1, clickInfo.date.getFullYear());
    setTargetDate(clickedDate);
  };
  const calculateEndTime = (reservation: Reservation): Date => {
    const startTime = parseDate(reservation.dateStart);
    const endTime = new Date(startTime.getTime() + reservation.duration * 60 * 60 * 1000);
    return endTime;
  };
  // Prepare events for FullCalendar from reservations on the target date
  const events = resListTargetDate.map((reservation) => ({
    title: `Table ${reservation.tableNumber}`,
    start: parseDate(reservation.dateStart),
    end: calculateEndTime(reservation),
  }));

  // Function to calculate end time based on start time and duration
  

  return (
    <div className="container">
      <h2>Reservation Overview</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="timeGridDay"
        editable={true}
        selectable={true}
        selectMirror={true}
        events={events}
        select={handleDateClick} // Callback for when a date is clicked
      />
        <h3>{targetDate}</h3>
    </div>
  );
};

export default ReservationOverview;

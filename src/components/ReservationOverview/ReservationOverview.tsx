import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllReservations, getReservationsByDate, requestReservationAdd, requestChangeReservationDetails } from "../../store/reducers/reservationsReducer";
import { Reservation } from "../../types/reservationTypes";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { parseDate } from "../../utils/reservations/dateUtils";
import { openFrom, openTo } from "../../config/settings";

const ReservationOverview: React.FC = () => {
  const [targetDate, setTargetDate] = useState<string>('28/06/24'); // Initial target date
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();

  const formatDate = (day: number, month: number, year: number): string => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedYear = year.toString().padStart(2, '0');
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };

  const resListTargetDate: Reservation[] = useSelector((state: any) =>
    getReservationsByDate(targetDate)(state)
  );

  useEffect(() => {
    const updatedEvents = resListTargetDate.map((reservation) => ({
      id: reservation.id,
      title: `Table ${reservation.tableNumber}`,
      start: calculateStartTime(reservation),
      end: calculateEndTime(reservation),
    }));
    setEvents(updatedEvents as any);
  }, [resListTargetDate]);

  const handleSelect = (selectInfo: any) => {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;
    const clickedDate = formatDate(startDate.getDate(), startDate.getMonth() + 1, startDate.getFullYear());
    const startHour = startDate.getHours();
    const duration = (endDate - startDate) / (1000 * 60 * 60); // Duration in hours

    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      dateStart: clickedDate,
      hour: startHour,
      duration,
      tableNumber: 1, // default table number, change as needed
      repeat: 'false',
    };
    dispatch(requestReservationAdd(newReservation) as any);
  };

  const handleEventResize = (resizeInfo: any) => {
    const { event } = resizeInfo;
    const updatedReservation: Reservation = {
      id: event.id,
      dateStart: formatDate(event.start.getDate(), event.start.getMonth() + 1, event.start.getFullYear()),
      hour: event.start.getHours(),
      duration: (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60),
      tableNumber: parseInt(event.title.replace("Table ", ""), 10),
      repeat: 'false',
    };
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const handleEventDrop = (dropInfo: any) => {
    const { event } = dropInfo;
    const updatedReservation: Reservation = {
      id: event.id,
      dateStart: formatDate(event.start.getDate(), event.start.getMonth() + 1, event.start.getFullYear()),
      hour: event.start.getHours(),
      duration: (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60),
      tableNumber: parseInt(event.title.replace("Table ", ""), 10),
      repeat: 'false',
    };
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const calculateEndTime = (reservation: Reservation): Date => {
    const startDay = parseDate(reservation.dateStart);
    const endTime = new Date(startDay.getTime() + reservation.hour * 60 * 60 * 1000 + reservation.duration * 60 * 60 * 1000);
    return endTime;
  };

  const calculateStartTime = (reservation: Reservation): Date => {
    const startDay = parseDate(reservation.dateStart);
    const startTime = new Date(startDay.getTime() + reservation.hour * 60 * 60 * 1000);
    return startTime;
  };

  return (
    <div>
      <h2>Reservation Overview</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
        select={handleSelect} // Callback for when a date is clicked
        eventResize={handleEventResize} // Callback for when an event is resized
        eventDrop={handleEventDrop} // Callback for when an event is dragged and dropped
        height={750}
        aspectRatio={1}
        nowIndicator={true}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        slotDuration="00:30:00"
        businessHours={[
          {
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
            startTime: openFrom,
            endTime: openTo,
          }
        ]}
      />
    </div>
  );
};

export default ReservationOverview;

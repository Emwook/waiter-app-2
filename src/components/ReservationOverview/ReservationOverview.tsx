import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllReservations,
  requestReservationAdd,
  requestChangeReservationDetails
} from "../../store/reducers/reservationsReducer";
import { Reservation } from "../../types/reservationTypes";
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parseDate } from "../../utils/reservations/dateUtils";
import { getAllTables } from "../../store/reducers/tablesReducer";
import { sortTables } from "../../utils/sorting/sortTables";
import { Table } from "../../types/tableTypes";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { openFrom, openTo } from "../../config/settings";

// Define the Resource type
interface Resource {
  resourceId: number;
  resourceTitle: string;
}

const ReservationOverview: React.FC = () => {
  const dispatch = useDispatch();
  const DnDCalendar = withDragAndDrop(Calendar);

  const resList: Reservation[] = useSelector(getAllReservations);

  const calculateStartTime = (reservation: Reservation): Date => {
    return parseDate(reservation.dateStart, reservation.hour);
  };

  const calculateEndTime = (reservation: Reservation): Date => {
    const startTime = parseDate(reservation.dateStart, reservation.hour);
    return new Date(startTime.getTime() + reservation.duration * 60 * 60 * 1000);
  };

  const events = resList.map((reservation) => ({
    id: reservation.id,
    title: `Table ${reservation.tableNumber} - ${reservation.id}`,
    start: calculateStartTime(reservation),
    end: calculateEndTime(reservation),
    resourceId: reservation.tableNumber,
    allDay: false,
  }));

  const handleSelectSlot = ({ start, end, resourceId }: any) => {
    const clickedDate = moment(start).format("DD/MM/YY");
    const startHour = moment(start).hours();
    const startMinute = moment(start).minutes();
    const duration = moment(end).diff(moment(start), 'hours', true);
    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      dateStart: clickedDate,
      hour: startHour + startMinute / 60,
      duration,
      tableNumber: resourceId,
      repeat: 'false',
    };
    dispatch(requestReservationAdd(newReservation) as any);
  };

  const handleEventResize = ({ event, start, end }: any) => {
    const updatedReservation: Reservation = {
      id: event.id,
      dateStart: moment(start).format("DD/MM/YY"),
      hour: moment(start).hours() + moment(start).minutes() / 60,
      duration: moment(end).diff(moment(start), 'hours', true),
      tableNumber: parseInt(event.resourceId, 10),
      repeat: event.repeat,
    };
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const handleEventDrop = ({ event, start, end, resourceId }: any) => {
    const updatedReservation: Reservation = {
      id: event.id,
      dateStart: moment(start).format("DD/MM/YY"),
      hour: moment(start).hours() + moment(start).minutes() / 60,
      duration: moment(end).diff(moment(start), 'hours', true),
      tableNumber: parseInt(resourceId, 10),
      repeat: event.repeat,
    };
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const tables: Table[] = useSelector(getAllTables);
  const sortedTables = sortTables(tables, 'tableNumber');
  const resources: Resource[] = sortedTables.map((table) => ({
    resourceId: table.tableNumber,
    resourceTitle: `Table ${table.tableNumber}`
  }));

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(2024, 5, 30),
      scrollToTime: new Date(1972, 0, 1, 8),
    }),
    []
  );

  return (
    <div>
      <h2>Reservation Overview</h2>
      <DnDCalendar
        defaultDate={defaultDate}
        defaultView={Views.DAY}
        events={events}
        localizer={momentLocalizer(moment)}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        resizable
        resources={resources}
        resourceIdAccessor={resource => ((resource as Resource).resourceId as number)}
        resourceTitleAccessor={resource => ((resource as Resource).resourceTitle as string)}
        scrollToTime={scrollToTime}
        selectable
        views={['day', 'month']}
        onSelectSlot={handleSelectSlot}
        min={openFrom}
        max={openTo}
        step={15}
        timeslots={4}
      />
    </div>
  );
};

export default ReservationOverview;

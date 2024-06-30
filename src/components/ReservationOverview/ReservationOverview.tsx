import React, { useEffect, useMemo, useState } from "react";
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

const ReservationOverview: React.FC = () => {
  const dispatch = useDispatch();
  const DnDCalendar = withDragAndDrop(Calendar);

  const resList: Reservation[] = useSelector(getAllReservations);

  const calculateStartTime = (reservation: Reservation): Date => {
    const startTime = parseDate(reservation.dateStart, reservation.hour);
    return startTime;
  };

  const calculateEndTime = (reservation: Reservation): Date => {
    const startTime = parseDate(reservation.dateStart, reservation.hour);
    const endTime = new Date(startTime.getTime() + reservation.duration * 60 * 60 * 1000);
    return endTime;
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
    const duration = moment(end).diff(moment(start), 'hours', true); // Duration in hours, with fractional part
    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      dateStart: clickedDate,
      hour: startHour + startMinute / 60, // Calculate hour with fractional part
      duration,
      tableNumber: resourceId,
      repeat: 'false',
    };
    dispatch(requestReservationAdd(newReservation) as any);
  };

  const handleEventResize = (resizeInfo: any) => {
    const { event } = resizeInfo;
    const updatedReservation: Reservation = {
      id: event.id,
      dateStart: moment(event.start).format("DD/MM/YY"),
      hour: moment(event.start).hours() + moment(event.start).minutes() / 60,
      duration: moment(event.end).diff(moment(event.start), 'hours', true),
      tableNumber: parseInt(event.resourceId, 10),
      repeat: (event.repeat),
    };
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const handleEventDrop = (dropInfo: any) => {
    const { event } = dropInfo;
    const updatedReservation: Reservation = {
      id: event.id,
      dateStart: moment(event.start).format("DD/MM/YY"),
      hour: moment(event.start).hours(),
      duration: moment(event.end).diff(moment(event.start), 'hours'),
      tableNumber: parseInt(event.resourceId, 10),
      repeat: 'false',
    };
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const tables: Table[] = useSelector(getAllTables);
  const sortedTables = sortTables(tables, 'tableNumber');
  const resources = sortedTables.map((table) => ({
    id: table.tableNumber,
    title: `Table ${table.tableNumber}`
  }));

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(2024, 5, 30),
      scrollToTime: new Date(1972, 0, 1, 8),
    }),
    []
  )
  console.log(events);
  return (
    <div>
      <h2>Reservation Overview</h2>
      <DnDCalendar
        defaultDate={defaultDate}
        scrollToTime={scrollToTime}
        localizer={momentLocalizer(moment)}
        events={events}
        resources={resources}
        selectable
        resizable
        defaultView={Views.DAY}
        views={['day', 'month']}
        onSelectSlot={handleSelectSlot}
        onEventResize={handleEventResize}
        onEventDrop={handleEventDrop}
        style={{ height: 750 }}
        min={openFrom}
        max={openTo}
        step={30}
        timeslots={1}
      />
    </div>
  );
};

export default ReservationOverview;

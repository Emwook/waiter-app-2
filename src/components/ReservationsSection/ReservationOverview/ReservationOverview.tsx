import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllReservations,
  requestReservationAdd,
  requestChangeReservationDetails,
  requestReservationRemove,
} from "../../../store/reducers/reservationsReducer";
import { Reservation } from "../../../types/reservationTypes";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { formatDate, parseDate } from "../../../utils/reservations/dateUtils";
import { getAllTables } from "../../../store/reducers/tablesReducer";
import { sortTables } from "../../../utils/sorting/sortTables";
import { Table } from "../../../types/tableTypes";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { openFrom, openTo } from "../../../config/settings";
import { generateReservationId } from "../../../utils/reservations/generateReservationId";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { Button} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import CalendarToolbar from "../CalendarToolbar/CalendarToolbar";

interface Resource {
  resourceId: number;
  resourceTitle: string;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: number;
  repeat: string;
  name: string;
  details: string;
  allDay: boolean;
  isDraggable: boolean;
}

interface ReservationOverviewProps {
  setDate: React.Dispatch<React.SetStateAction<Date>>
  setSelectedRes:  React.Dispatch<React.SetStateAction<Reservation>>
  selectedRes: Reservation;
}

const ReservationOverview: React.FC<ReservationOverviewProps> = ({setDate, setSelectedRes, selectedRes}) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const dispatch = useDispatch();
  const DnDCalendar = withDragAndDrop(Calendar);
  const resListToday: Reservation[] = useSelector(getAllReservations);
  const [localResListToday, setLocalResListToday] = useState<Reservation[]>(resListToday);
  setDate(startDate); // a change 

  useEffect(() => {
    setLocalResListToday(resListToday);
  }, [startDate, resListToday]);


  const calculateStartTime = (reservation: Reservation): Date => {
    return parseDate(reservation.dateStart, reservation.hour);
  };

  const calculateEndTime = (reservation: Reservation): Date => {
    const startTime = parseDate(reservation.dateStart, reservation.hour);
    return new Date(startTime.getTime() + reservation.duration * 60 * 60 * 1000);
  };

  const events: Event[] = localResListToday.map((reservation) => ({
    id: reservation.id,
    title: `${reservation.id}`,
    start: calculateStartTime(reservation),
    end: calculateEndTime(reservation),
    resourceId: reservation.tableNumber,
    repeat: reservation.repeat,
    name: reservation.name,
    details: reservation.details,
    allDay: false,
    isDraggable: true,
  }));

  const handleSelectSlot = ({ start, end, resourceId }: any) => {
    const clickedDate = moment(start).format("DD/MM/YY");
    const startHour = moment(start).hours();
    const startMinute = moment(start).minutes();
    const duration = moment(end).diff(moment(start), "hours", true);
    const newReservation: Reservation = {
      id: generateReservationId(),
      dateStart: clickedDate,
      hour: startHour + startMinute / 60,
      duration,
      tableNumber: resourceId,
      repeat: "false",
      name: '',
      details: '',
    };
    dispatch(requestReservationAdd(newReservation) as any);
    setLocalResListToday([...localResListToday, newReservation]);
    setSelectedRes(newReservation);
  };

  const handleEventResize = ({ event, start, end }: any) => {
    const updatedReservation: Reservation = {
      id: event.id,
      dateStart: moment(start).format("DD/MM/YY"),
      hour: moment(start).hours() + moment(start).minutes() / 60,
      duration: moment(end).diff(moment(start), "hours", true),
      tableNumber: parseInt(event.resourceId, 10),
      repeat: "false",
      name: event.name,
      details: event.details,
    };
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
    setLocalResListToday(localResListToday.map(res => res.id === event.id ? updatedReservation : res));
    handleSelectEvent(event);
  };

  const handleEventDrop = ({ event, start, end, resourceId }: any) => {
    const updatedReservation: Reservation = {
      id: event.id,
      dateStart: moment(start).format("DD/MM/YY"),
      hour: moment(start).hours() + moment(start).minutes() / 60,
      duration: moment(end).diff(moment(start), "hours", true),
      tableNumber: parseInt(resourceId, 10),
      repeat: event.repeat,
      name: event.name,
      details: event.details,
    };
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
    setLocalResListToday(localResListToday.map(res => res.id === event.id ? updatedReservation : res));
  };

  const handleEventRemove = (event: Event) => {
    const reservation = localResListToday.filter(res => (res.id === event.title))
    dispatch(requestReservationRemove(reservation[0]) as any);
    setLocalResListToday(localResListToday.filter(res => res.id !== event.title));
  };

  const eventPropGetter = (event: Event) => {
    return {
      style: {
        backgroundColor: event.isDraggable ? "#fff" : "#6c757d",
        marginLeft: "4px",
        color: "#212529",
        border: ((event.title) === selectedRes.id) ?'1px solid #212529' : '1px solid #ced4da' ,
      },
    };
  };

  const EventComponent = (event: Event) => {
    return (
      <div className="text-dark d-flex justify-content-between">
        <span style={{ fontSize: '10px' }} className="my-0 text-primary">
          {event.title}
        </span>
        <Button
          onClick={() => handleEventRemove(event)}
          className="mt-0 bg-danger py-0 px-2 border-0"
          size="sm"
          style={{ marginLeft: '5px', fontSize:'5px' }}
        >
          <i className="bi bi-trash" style={{ fontSize: '10px' }} />
        </Button>
      </div>
    );
  };

  const tables: Table[] = useSelector(getAllTables);
  const sortedTables = sortTables(tables, "tableNumber");
  const tableNumbers = sortedTables.map((table) => table?.tableNumber);
  const resources: Resource[] = tableNumbers?.map((num) => ({
    resourceId: num,
    resourceTitle: `Table ${num}`,
  }));

  const { defaultDate, scrollToTime, formats } = useMemo(
    () => ({
      defaultDate: new Date(2024, 1, 1),
      scrollToTime: new Date(1972, 0, 1, 8),
      formats: {
        timeGutterFormat: (date: any, culture: any, localizer: any) =>
          localizer.format(date, 'hh:mm', culture),
        eventTimeRangeFormat: ({ start, end }: any, culture: any, localizer: any) =>
          localizer.format(start, 'hh:mm', culture) +
          ' - ' +
          localizer.format(end, 'hh:mm', culture),
    }}),
    []
  );

  const handleSelectEvent = (event: Object) => {
    const e = event as Event;
    const startDate = formatDate(e.start);
    const endDate = formatDate(e.end);
    const res: Reservation = {
      id: e.id,
      dateStart: startDate.dateString,
      hour: startDate.hour,
      duration: (endDate.hour - startDate.hour),
      tableNumber: e.resourceId,
      repeat: e.repeat,
      name: e.name,
      details: e.details,
    }
    setSelectedRes(res);
  }

  const handleNavigate = (action: 'prev' | 'next' | 'today' | 'date', newDate: Date): void => {
    setStartDate(newDate);
  };


  
  
  return (
    <div className="mb-3 mx-0">
      <CalendarToolbar
        date={startDate}
        onNavigate={handleNavigate}
        onSetDate={setStartDate}
      />
      <div className="z-0">
        <DnDCalendar
          defaultDate={defaultDate}
          defaultView={Views.DAY}
          events={events}
          onSelectEvent={handleSelectEvent}
          localizer={momentLocalizer(moment)}
          formats={formats}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          resizable
          resourceIdAccessor={(resource) => (resource as Resource).resourceId}
          resourceTitleAccessor={(resource) => (resource as Resource).resourceTitle}
          draggableAccessor={(event) => (event as Event).isDraggable}
          resizableAccessor={(event) => true}
          eventPropGetter={(event) => eventPropGetter(event as Event)}
          components={{
            event: EventComponent as any,
            toolbar: () => <></>,
          }}
          resources={resources}
          scrollToTime={scrollToTime}
          selectable
          views={["day"]}
          onSelectSlot={handleSelectSlot}
          min={openFrom}
          max={openTo}
          date={startDate}
          step={15}
          timeslots={4}
        />
      </div>
    </div>
  );
};

export default ReservationOverview;

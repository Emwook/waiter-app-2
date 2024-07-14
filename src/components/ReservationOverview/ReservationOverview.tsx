import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllReservations,
  requestReservationAdd,
  requestChangeReservationDetails,
  requestReservationRemove,
} from "../../store/reducers/reservationsReducer";
import { Reservation } from "../../types/reservationTypes";
import { Calendar, DateLocalizer, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { formatDate, parseDate } from "../../utils/reservations/dateUtils";
import { getAllTables } from "../../store/reducers/tablesReducer";
import { sortTables } from "../../utils/sorting/sortTables";
import { Table } from "../../types/tableTypes";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { openFrom, openTo } from "../../config/settings";
import { generateReservationId } from "../../utils/reservations/generateReservationId";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { Button, Container} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import CalendarToolbar from "../CalendarToolbar/CalendarToolbar";
import SelectedResDetails from "../SelectedResDetails/SelectedResDetails";

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
  allDay: boolean;
  isDraggable: boolean;
}

interface ReservationOverviewProps {
  setDate: React.Dispatch<React.SetStateAction<Date>>
}

const ReservationOverview: React.FC<ReservationOverviewProps> = ({setDate}) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const dispatch = useDispatch();
  const DnDCalendar = withDragAndDrop(Calendar);
  const resListToday: Reservation[] = useSelector(getAllReservations);
  const [localResListToday, setLocalResListToday] = useState<Reservation[]>(resListToday);
  const [showSelectedRes, setShowSelectedRes] = useState<Boolean>(false);
  const [selectedRes, setSelectedRes] = useState<Reservation>(resListToday[0]);

  useEffect(() => {
    setDate(startDate);
    setLocalResListToday(resListToday);
  }, [startDate, setDate, resListToday]);


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
    allDay: false,
    isDraggable: true,
  }));

  const handleSelectSlot = ({ start, end, resourceId }: any) => {
    const clickedDate = moment(start).format("DD/MM/YY");
    const startHour = moment(start).hours();
    const startMinute = moment(start).minutes();
    const duration = moment(end).diff(moment(start), "hours", true);
    const newReservation: Reservation = {
      id: generateReservationId(clickedDate, "false"),
      dateStart: clickedDate,
      hour: startHour + startMinute / 60,
      duration,
      tableNumber: resourceId,
      repeat: "false",
    };
    dispatch(requestReservationAdd(newReservation) as any);
    setLocalResListToday([...localResListToday, newReservation]);
    setShowSelectedRes(false);
    setSelectedRes(newReservation);
    setShowSelectedRes(true);
  };

  const handleEventResize = ({ event, start, end }: any) => {
    const updatedReservation: Reservation = {
      id: event.id,
      dateStart: moment(start).format("DD/MM/YY"),
      hour: moment(start).hours() + moment(start).minutes() / 60,
      duration: moment(end).diff(moment(start), "hours", true),
      tableNumber: parseInt(event.resourceId, 10),
      repeat: "false",
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
      repeat: "false",
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
        backgroundColor: event.isDraggable ? "#f8f9fa" : "#6c757d",
        marginLeft: "4px",
        color: "#212529",
      },
    };
  };

  const EventComponent = (event: Event) => {
    return (
      <div className="text-dark">
        <span style={{ fontSize: '11px' }} className="my-0 text-primary">
          {event.title}
        </span>
        <Button
          onClick={() => handleEventRemove(event)}
          className="mt-0 bg-danger py-0 px-2 border-0"
          size="sm"
          style={{ marginLeft: '5px' }}
        >
          <i className="bi bi-trash" style={{ fontSize: '10px' }} />
        </Button>
      </div>
    );
  };

  const tables: Table[] = useSelector(getAllTables);
  const sortedTables = sortTables(tables, "tableNumber");
  const tableNumbers = sortedTables.map((table) => table.tableNumber);
  const resources: Resource[] = tableNumbers.map((num) => ({
    resourceId: num,
    resourceTitle: `Table ${num}`,
  }));
  
  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(2024, 6, 4),
      scrollToTime: new Date(1972, 0, 1, 8),
    }),
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
      repeat: 'false', //hardcoded false for now, until i get to redoing the whole repeating res thing
    }
    setSelectedRes(res);
    setShowSelectedRes(true);
  }

  const handleNavigate = (action: 'prev' | 'next' | 'today' | 'date', newDate: Date): void => {
    setStartDate(newDate);
  };

  return (
    <Container className="mb-3">
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
      <div className=" bg-none p-2 w-100 border border-gray mt-2 text-center" style={{ minHeight: '100px' }}>
        {showSelectedRes &&
         <SelectedResDetails reservation={selectedRes} tableNumbers={tableNumbers}/>
        }
      </div>
    </Container>
  );
};

export default ReservationOverview;

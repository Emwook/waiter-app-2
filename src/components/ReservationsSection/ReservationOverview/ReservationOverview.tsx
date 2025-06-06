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
import { Button, Row} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { Col } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Loading from "../../SharedLayoutComponents/Loading/Loading";

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
  setDate(startDate); // a change, an old one perhaps but a change none the less
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    setLocalResListToday(resListToday);
  }, [startDate, resListToday]);

  // const areDatesIntegerWeeksApart = (d1: Date, d2: Date): boolean => {
  //   const millisecondsInADay = 1000 * 60 * 60 * 24; // Total milliseconds in a day
  //   const daysDifference = Math.abs(d1.getTime() - d2.getTime()) / millisecondsInADay;
  //   const roundedDaysDifference = Math.round(daysDifference);
  //   console.log('is true?: ', roundedDaysDifference % 7 === 0, 'daysDifference:', roundedDaysDifference);
  //   return roundedDaysDifference % 7 === 0;
  // };
  

  // const areDatesIntegerMonthsApart = (d1: Date, d2: Date): boolean => {
  //   const yearDifference = d2.getFullYear() - d1.getFullYear();
  //   const monthDifference = d2.getMonth() - d1.getMonth();
  //   const totalMonthsDifference = yearDifference * 12 + monthDifference;
  //   return Math.abs(totalMonthsDifference) >= 1;  // Must be at least 1 full month apart
  // };
  

  // const areDatesIntegerYearsApart = (d1: Date, d2: Date): boolean => {
  //   const yearDifference = Math.abs(d2.getFullYear() - d1.getFullYear());
  //   const sameMonthAndDay = d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  //   return yearDifference >= 1 && sameMonthAndDay;
  // };

  const calculateStartTime = (reservation: Reservation): Date => {
    const originalDate = parseDate(reservation.dateStart, reservation.hour);
    let dateStart: Date = originalDate;
  
    // switch(reservation.repeat) {
    //   case 'daily':
    //     dateStart = new Date(startDate);
    //     break;
  
    //   case 'weekly':
    //     if (areDatesIntegerWeeksApart(originalDate, startDate)) {
    //       dateStart = new Date(startDate);
    //     }
    //     break;
  
    //   case 'monthly':
    //     if (areDatesIntegerMonthsApart(originalDate, startDate)) {
    //       dateStart = new Date(startDate);
    //     }
    //     break;
  
    //   case 'annually':
    //     if (areDatesIntegerYearsApart(originalDate, startDate)) {
    //       dateStart = new Date(startDate);
    //     }
    //     break;
  
    //   default:
    //     break;
    // }
  
    // console.log('reservation: ', reservation.repeat, ', dateStart: ', dateStart, 'startDate: ', startDate);
    return dateStart;
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
      defaultDate: new Date(),
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
  const handleTimeOut = () => {
    let timer: NodeJS.Timeout | null = null;
  
    if (visible) {
      setVisible(false);
  
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      timer = setTimeout(() => {
        setVisible(true);
        timer = null;
      }, 500); 
    }
  };

  const handleNavigate = (action: 'prev' | 'next' | 'today' | 'date', newDate: Date): void => {
    handleTimeOut();
    setStartDate(newDate);
  };

  const goToBack = () => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() - 1);
    handleNavigate('prev', newDate);
  };

  const goToNext = () => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + 1);
    handleNavigate('next', newDate);
  };

  const goToToday = () => {
    const newDate = new Date();
    handleNavigate('today', newDate);
  };

  const handleDateChange = (selectedDate: Date) => {
    setStartDate(selectedDate);
  };
 
  
  
  
  return (
    <div className="mb-3 mx-0">
        <Row className='d-flex mb-2'>
          <Col xs={3} sm={3} md={6} className="py-xs-0 m-xs-0">
              <Button variant="light" className="border border-gray rounded-1" onClick={goToToday}>
                  Today
              </Button>
          </Col>
          <Col xs={9} sm={9} md={6} className='justify-content-end d-flex'>
              <Button variant="light" onClick={goToBack} className='px-auto border border-gray'>
                  <i className="bi bi-arrow-left" />
              </Button>
              <DatePicker 
                  selected={startDate} 
                  onChange={date => handleDateChange(date as Date)} 
                  className="text-center form-control rounded-1"
                  dateFormat="dd/MM/yyyy"
              />
              <Button variant="light" onClick={goToNext} className='px-auto rounded-right border border-gray'>
                  <i className="bi bi-arrow-right" />
              </Button>
          </Col>
      </Row>
      <div className="z-0">
        {visible ? ( 
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
        ):(
          <Loading/>
        )}
      </div>
    </div>
  );
};

export default ReservationOverview;

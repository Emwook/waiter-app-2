import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Reservation } from "../../types/reservationTypes";
import { formatHour } from "../../utils/reservations/formatHour";
import { Row, Col, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { formatDate, parseDate } from "../../utils/reservations/dateUtils";
import { requestChangeReservationDetails } from "../../store/reducers/reservationsReducer";
import "react-datepicker/dist/react-datepicker.css";
import { possibleRepeatList } from "../../config/settings";


interface SelectedResDetailsProps {
  reservation: Reservation;
  tableNumbers: number[];
}

const SelectedResDetails: React.FC<SelectedResDetailsProps> = ({ reservation, tableNumbers }) => {
  const dispatch = useDispatch();
  const convertTimeToDecimal = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const decimalMinutes = minutes / 60;
    return hours + decimalMinutes;
  };

  const [date, setDate] = React.useState<Date>(parseDate(reservation.dateStart, reservation.hour));
  const [tableNumber, setTableNumber] = React.useState<number>(reservation.tableNumber);
  const [hour, setHour] = React.useState<string>(formatHour(reservation.hour));
  const [hourEnd, setHourEnd] = React.useState<string>(formatHour(reservation.hour + reservation.duration));
  const [repeat, setRepeat] = React.useState<string>(reservation.repeat);
  const [name, setName] = React.useState<string>('');


  useEffect(() => {
    setDate(parseDate(reservation.dateStart, reservation.hour));
    setTableNumber(reservation.tableNumber);
    setHour(formatHour(reservation.hour));
    setHourEnd(formatHour(reservation.hour + reservation.duration));
    (reservation.name) && setName(reservation.name);
  }, [reservation]);

  const handleDateChange = (selectedDate: Date) => {
    const { dateString } = formatDate(selectedDate);
    const updatedReservation: Reservation = {
      ...reservation,
      dateStart: dateString,
    };
    setDate(selectedDate);
    // setReservation(updatedReservation);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const handleTableNumberChange = (num: number) => {
    const updatedReservation: Reservation = {
      ...reservation,
      tableNumber: num,
    };
    setTableNumber(num);
    // setReservation(updatedReservation);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hourString = event.target.value;
    const UpdatedDuration = Number(convertTimeToDecimal(hourEnd) - convertTimeToDecimal(hourString))
    const updatedReservation: Reservation = {
      ...reservation,
      hour: convertTimeToDecimal(hourString),
      duration: UpdatedDuration,
    };
    setHour(hourString);
    // setReservation(updatedReservation);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };
  const handleHourEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hourString = event.target.value;
    const duration: number = convertTimeToDecimal(hourString) - convertTimeToDecimal(hour);
    const updatedReservation: Reservation = {
      ...reservation,
      duration: duration,
    };
    setHourEnd(hourString);
    // setReservation(updatedReservation);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const handleRepeatTypeChange = (repeatType: string) => {
    const updatedReservation: Reservation = {
      ...reservation,
      repeat: repeatType,
    };
    setRepeat(repeatType);
    // setReservation(updatedReservation);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value as string;
    const updatedReservation: Reservation = {
      ...reservation,
      name: name,
    };
    setName(name);
    // setReservation(updatedReservation);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  return (
    <>
      <Row className="px-3 py-auto mb-2 mx-2 text-start">
        <Col xs={2}><h5 className=" pr-2">Reservation ID:</h5></Col>
        <Col xs={4}><h5 className="pr-2 text-secondary">{reservation?.id}</h5></Col>
        <Col xs={2}><h5 className=" pr-2">Name:</h5></Col>
        <Col xs={4}>
          <Form.Control 
              type="text" 
              name={`name`}
              className={"border-gray text-left w-50"} 
              value = {reservation?.name}
              onChange={handleNameChange}
              placeholder = {reservation.name?name:'abc'}
          />
        </Col>
      </Row>
      <Row className="px-3 py-auto mb-2 mx-2 text-start">
        <Col xs={2}><h5>Table:</h5></Col>
         <Col xs={4}>
          <Form.Select
            onChange={e => handleTableNumberChange(Number(e.target.value))}
            name="tableNumber"
            className="border-gray text-center rounded-2 w-50"
            value={tableNumber}
          >
            {tableNumbers.map(num =>
              <option
                key={num}
                value={num}
              >
                {num}
              </option>
            )}
          </Form.Select>
        </Col>
        <Col xs={2}><h5>Time:</h5></Col>
         <Col xs={4}>
          <Row>
              <Col xs={4} className="m-0 p-0">
                <Form.Control
                  type="time"
                  value={hour}
                  onChange={handleHourChange}
                  className="rounded-2 text-center"
                  min="12:00"
                  max="24:00"
                />
              </Col>
              <Col xs={1} className="my-0 px-4"><span>-</span></Col>
              <Col xs={4} className="m-0 p-0">
                  <Form.Control
                    type="time"
                    value={hourEnd}
                    onChange={handleHourEndChange}
                    className="rounded-2 text-center"
                    min="12:00"
                    max="24:00"
                  />
                </Col>
          </Row>
        </Col>
      </Row>
      <Row className="px-3 mx-2 text-start">
       <Col xs={2}><h5>Date:</h5></Col>
        <Col xs={4}>
          <DatePicker
            selected={date}
            onChange={date => handleDateChange(date as Date)}
            className="text-center form-control"
            dateFormat="dd/MM/yyyy"
          />
        </Col>
        <Col xs={2}><h5>Repeating:</h5></Col>
        <Col xs={4}>
          <Form.Select
            onChange={e => handleRepeatTypeChange(String(e.target.value))}
            name="repeatForm"
            className="border-gray text-center rounded-2 w-50"
            value={repeat}
          >
            {possibleRepeatList.map(num =>
              <option
                key={num}
                value={num}
              >
                {num}
              </option>
            )}
          </Form.Select>
        </Col>
      </Row>
    </>
  );
};

export default SelectedResDetails;

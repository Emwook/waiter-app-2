import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Reservation } from "../../types/reservationTypes";
import { formatHour } from "../../utils/reservations/formatHour";
import { Row, Col, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { formatDate, parseDate } from "../../utils/reservations/dateUtils";
import { requestChangeReservationDetails } from "../../store/reducers/reservationsReducer";
import "react-datepicker/dist/react-datepicker.css";

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

  useEffect(() => {
    setDate(parseDate(reservation.dateStart, reservation.hour));
    setTableNumber(reservation.tableNumber);
    setHour(formatHour(reservation.hour));
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
    const updatedReservation: Reservation = {
      ...reservation,
      hour: convertTimeToDecimal(hourString),
    };
    setHour(hourString);
    // setReservation(updatedReservation);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  return (
    <>
      <Row className="px-3 py-auto mb-2 mx-2 border-dark border-bottom text-secondary">
        <Col><h5 className=" pr-2">Reservation ID</h5></Col>
        <Col><h5>Table</h5></Col>
        <Col><h5>Date</h5></Col>
        <Col><h5>Time</h5></Col>
        <Col><h5>Repeating</h5></Col>
      </Row>
      <Row className="px-3 mx-2">
        <Col><h5 className="pr-2">{reservation?.id}</h5></Col>
        <Col>
          <Form.Select
            onChange={e => handleTableNumberChange(Number(e.target.value))}
            name="tableNumber"
            className="border-gray text-center rounded-2"
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
        <Col>
          <DatePicker
            selected={date}
            onChange={date => handleDateChange(date as Date)}
            className="text-center form-control"
            dateFormat="dd/MM/yyyy"
          />
        </Col>
        <Col>
          <Form.Control
            type="time"
            value={hour}
            onChange={handleHourChange}
            className="rounded-2 text-center"
            min="08:00"
            max="22:00"
          />
        </Col>
        <Col><h5>{reservation?.repeat}</h5></Col>
      </Row>
    </>
  );
};

export default SelectedResDetails;

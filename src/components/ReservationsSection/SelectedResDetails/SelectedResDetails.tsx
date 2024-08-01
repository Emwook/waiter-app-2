import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Reservation } from "../../../types/reservationTypes";
import { formatHour } from "../../../utils/reservations/formatHour";
import { Col, Row, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { formatDate, parseDate } from "../../../utils/reservations/dateUtils";
import { requestChangeReservationDetails } from "../../../store/reducers/reservationsReducer";
import "react-datepicker/dist/react-datepicker.css";
import { possibleRepeatList } from "../../../config/settings";


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

  const [date, setDate] = useState<Date>(new Date());
  const [tableNumber, setTableNumber] = useState<number>(0);
  const [hour, setHour] = useState<string>('');
  const [hourEnd, setHourEnd] = useState<string>('');
  const [repeat, setRepeat] = useState<string>('');
  const [name, setName] =  useState<string>('');


  useEffect(() => {
    setName('');
    setDate(parseDate(reservation?.dateStart, reservation?.hour));
    setTableNumber(reservation?.tableNumber);
    setHour(formatHour(reservation?.hour));
    setHourEnd(formatHour(reservation?.hour + reservation?.duration));
    setRepeat(reservation?.repeat);
    setName(reservation?.name || '');
  }, [reservation]);

  const handleDateChange = (selectedDate: Date) => {
    const { dateString } = formatDate(selectedDate);
    const updatedReservation: Reservation = {
      ...reservation,
      dateStart: dateString,
    };
    setDate(selectedDate);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const handleTableNumberChange = (num: number) => {
    const updatedReservation: Reservation = {
      ...reservation,
      tableNumber: num,
    };
    setTableNumber(num);
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
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const handleRepeatTypeChange = (repeatType: string) => {
    const updatedReservation: Reservation = {
      ...reservation,
      repeat: repeatType,
    };
    setRepeat(repeatType);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value as string;
    const updatedReservation: Reservation = {
      ...reservation,
      name: newName,
    };
    setName(newName);
    dispatch(requestChangeReservationDetails(updatedReservation) as any);
    };
  return (
    (reservation) ? (
    <div className="border border-dark rounded-1 px-1 mt-5 pb-3">
      <Col className="mx-3 my-3 text-start">
        <Row className="mt-2"><h6>Reservation ID:</h6></Row>
        <Row className="mt-2"><h5 className="text-primary lead">{reservation?.id}</h5></Row>
        <Row className="mt-2"><h6>Name:</h6></Row>
        <Row className="px-1">
            <Form.Control
                type="text"
                name="name"
                className="border-gray text-left w-50"
                value={name}
                onChange={handleNameChange}
                //placeholder={reservation.name ? reservation.name : 'abc'}
            />
        </Row>
        <Row className="mt-2"><h6>Table:</h6></Row>
        <Row className="px-1">
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
        </Row>
        <Row className="mt-2"><h6>Time:</h6></Row>
        <Row>
          <Col className="px-1 m-0">
            <Form.Control
              type="time"
              value={hour}
              onChange={handleHourChange}
              className="rounded-2 text-center"
              min="12:00"
              max="24:00"
            />
          </Col>
          <Col xs={1}><span>-</span></Col>
          <Col className="px-0 m-0">
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
        <Row className="mt-2"><h6>Date:</h6></Row>
        <Row className="px-1">
          <DatePicker
            selected={date}
            onChange={date => handleDateChange(date as Date)}
            className="text-center form-control"
            dateFormat="dd/MM/yyyy"
          />
        </Row>
        <Row className="mt-2"><h6>Repeating:</h6></Row>
        <Row className="px-1">
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
        </Row>
      </Col>
    </div>
  )
  :(
    <div className="d-flex mt-5">
      <div className="border border-gray rounded-1 px-1 m-auto pb-3 text-secondary w-100">
        <h6 className="mt-4 text-center">select a reservation <br/> to edit</h6>
      </div>
    </div>
  )
  );
};

export default SelectedResDetails;

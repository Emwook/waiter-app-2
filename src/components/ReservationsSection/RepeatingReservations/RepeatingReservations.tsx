import React from "react";
import { useSelector } from "react-redux";
import { getAllReservations } from "../../../store/reducers/reservationsReducer";
import { Reservation } from "../../../types/reservationTypes";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { formatHour } from "../../../utils/reservations/formatHour";
import { parseDate } from "../../../utils/reservations/dateUtils";


interface RepeatingReservationProps {
    chosenDate: Date;
    setSelectedRes:  React.Dispatch<React.SetStateAction<Reservation>>
    selectedRes: Reservation;
  }

const RepeatingReservations: React.FC<RepeatingReservationProps> = ({chosenDate, setSelectedRes, selectedRes}) => {
    const stripTime = (date: Date): Date => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      };
      
      const isAfter = (date1: Date, date2: Date): boolean => {
        const d1 = stripTime(date1);
        const d2 = stripTime(date2);
        return d1.getTime() >= d2.getTime();
      };
    
    const repResList: Reservation[] = useSelector(getAllReservations).filter((res: Reservation) => {
      const parsedDate = parseDate(res?.dateStart, 12);
      return res.repeat !== 'false' && isAfter(chosenDate, parsedDate);
    });
    
    const selectRes = (res:Reservation) => {
      setSelectedRes(res);
    }    
    return (
        <div className="bg-none mt-lg-5 mb-2">
            {repResList.map(res => (
                <Row xs={4} className={`px-0 py-3 mx-1 border rounded-1 bg-none mt-2 ${(selectedRes?.tableNumber === res?.tableNumber)?'border-dark':'border-gray'}`} onClick={() => selectRes(res)}>
                    <Col xs={12}>Table {res?.tableNumber}</Col>
                    <Col xs={12} className="text-primary">{res.id}</Col>
                    <Col xs={12}>{(res.name) &&'for'} {res.name} </Col>
                    <Col xs={12}>from {res?.dateStart}   {res?.repeat} </Col>
                    <Col xs={12}>{formatHour(res?.hour)} - {formatHour(Number(res?.hour) + res?.duration)}</Col>
                </Row>
            ))}
        </div>
    )
}

export default RepeatingReservations;
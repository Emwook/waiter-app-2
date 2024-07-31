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
  }

const RepeatingReservations: React.FC<RepeatingReservationProps> = ({chosenDate, setSelectedRes}) => {

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
    
    console.log("Filtered Reservations:", repResList);
    
    return (
        <div className="bg-none px-1 mt-5">
            {repResList.map(res => (
                <Row xs={4} className="p-3 mx-2 border border-gray rounded-1 bg-none mt-1">
                    <Col xs={12}><h6>Table {res?.tableNumber} <span className="text-primary">{res.id}</span></h6></Col>
                    <Col xs={12}><h6>{res?.name!== '' ? 'for': '.'} {res.name} </h6></Col>
                    <Col xs={12}><h6>from {res?.dateStart}   {res?.repeat} </h6></Col>
                    <Col xs={12}><h6>{formatHour(res?.hour)} - {formatHour(Number(res?.hour) + res?.duration)}</h6></Col>
                </Row>
            ))}
        </div>
    )
}

export default RepeatingReservations;
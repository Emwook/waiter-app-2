import React from "react";
import { useSelector } from "react-redux";
import { getRepeatingReservations } from "../../store/reducers/reservationsReducer";
import { Reservation } from "../../types/reservationTypes";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { formatHour } from "../../utils/reservations/formatHour";

const RepeatingReservations = () => {
    const repResList:Reservation[] = useSelector(getRepeatingReservations);
    return (
        <Row className="bg-none px-4">
            <h2>repeating reservations:</h2>
            {repResList.map(res => (
                <Col xs={4} className="p-3 mx-2 border border-gray rounded bg-none">
                    <Row><h3>Table {res.tableNumber} <span className="text-primary">{res.id}</span></h3></Row>
                    <Row><h3>{res.name!== '' ? 'for': '.'} {res.name} </h3></Row>
                    <Row><h3>from {res.dateStart}   {res.repeat} </h3></Row>
                    <Row><h4>{formatHour(res.hour)} - {formatHour(Number(res.hour) + res.duration)}</h4></Row>
                </Col>
            ))}
        </Row>
    )
}

export default RepeatingReservations;
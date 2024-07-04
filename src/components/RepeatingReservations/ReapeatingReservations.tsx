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
        <Row className="bg-none p-4">
            <h2>repeating reservations:</h2>
            {repResList.map(res => (
                <Col xs={4} className="p-3 mx-2 border border-dark rounded bg-light">
                    <Row><h3>Table {res.tableNumber}</h3></Row>
                    <Row><h4>{res.repeat} {formatHour(res.hour)} - {formatHour(Number(res.hour) + res.duration)}</h4></Row>
                    <Row><h5>reservation id: {res.id}</h5></Row>
                </Col>
            ))}
        </Row>
    )
}

export default RepeatingReservations;
import React from "react";
import RepeatingReservations from "../RepeatingReservations/ReapeatingReservations";
import ReservationOverview from "../ReservationOverview/ReservationOverview";
import { Container } from "react-bootstrap";

const ReservationPage = () => {
    return (
        <div>
            <h1> reservations coming here!</h1>
            <ul>
                <li>repeating reservations</li>
                <li>overview - yesterday/today/tomorrow card view</li>
                <li>detailed view - todays reservations sorted by table then hour</li>
            </ul>
            <Container>
                <ReservationOverview/>
                <RepeatingReservations/>
            </Container>
        </div>
    )
}

export default ReservationPage;
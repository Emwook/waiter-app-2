import React from "react";
import RepeatingReservations from "../RepeatingReservations/ReapeatingReservations";
import ReservationOverview from "../ReservationOverview/ReservationOverview";
import { Container } from "react-bootstrap";

const ReservationPage = () => {
    return (
        <div>
            <h1> reservations coming here!</h1>
            <ul>
                <li>repeating reservations - list type group of repeating reservations</li>
                <li>search - search window to look for a reservation by its id</li>
                <li>overview - calendar view with DnD for editablitiy</li>
                <li>detailed view - editable single reservation for variables different than time and duration</li>
            </ul>
            <Container>
                <RepeatingReservations/>
                <ReservationOverview/>
            </Container>
        </div>
    )
}

export default ReservationPage;
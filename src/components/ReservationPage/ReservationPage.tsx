import React from "react";
import RepeatingReservations from "../RepeatingReservations/ReapeatingReservations";

const ReservationPage = () => {
    return (
        <div>
            <h1> reservations coming here!</h1>
            <ul>
                <li>repeating reservations</li>
                <li>overview - yesterday/today/tomorrow card view</li>
                <li>detailed view - todays reservations sorted by table then hour</li>
            </ul>
            <RepeatingReservations/>
        </div>
    )
}

export default ReservationPage;
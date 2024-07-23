import React, { useEffect, useState } from "react";
import RepeatingReservations from "../RepeatingReservations/RepeatingReservations";
import ReservationOverview from "../ReservationOverview/ReservationOverview";
import { useDispatch } from "react-redux";
import { formatDate } from "../../../utils/reservations/dateUtils";
import { fetchReservationsByDate } from "../../../store/reducers/reservationsReducer";

const ReservationPage = () => {
    const dispatch = useDispatch();
    const [date, setDate] = useState(new Date());
    const formattedDate = formatDate(date);

    useEffect(() => {
        dispatch(fetchReservationsByDate(formattedDate.dateString) as any);
    }, [dispatch, formattedDate]);
  
    return (
        <div className="my-4">            
                <ReservationOverview setDate={setDate}/>
                <RepeatingReservations/>
                <ul className="mt-4 border-top border-dark">
                    <li>repeating reservations - list type group of repeating reservations <i className="bi bi-check"></i></li>
                    <li>search - search window to look for a reservation by its id <i className="bi bi-dash"></i></li>
                    <li>overview - calendar view with DnD for editablitiy <i className="bi bi-plus-slash-minus"></i></li>
                    <li>detailed view - editable single reservation for variables different than time and duration <i className="bi bi-plus-slash-minus"></i></li>
                </ul>
        </div>
    )
}

export default ReservationPage;
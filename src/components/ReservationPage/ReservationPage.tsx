import React, { useEffect, useState } from "react";
import RepeatingReservations from "../RepeatingReservations/ReapeatingReservations";
import ReservationOverview from "../ReservationOverview/ReservationOverview";
import { useDispatch } from "react-redux";
import { formatDate } from "../../utils/reservations/dateUtils";
import { fetchAllReservationData, fetchReservationsByDate } from "../../store/reducers/reservationsReducer";

const ReservationPage = () => {
    const dispatch = useDispatch();
    const [date, setDate] = useState(new Date());
    const formattedDate = formatDate(date);
    console.log(formattedDate);
    // Dispatch the setTables action when the data is loaded
    useEffect(() => {
        dispatch(fetchReservationsByDate(formattedDate.dateString) as any);
        //dispatch(fetchAllReservationData() as any);
    }, [dispatch, formattedDate]);
  
    return (
        <div className="my-4">            
                <ReservationOverview setDate={setDate}/>
                <RepeatingReservations/>
                <ul className="mt-4 border-top border-dark">
                    <li>repeating reservations - list type group of repeating reservations</li>
                    <li>search - search window to look for a reservation by its id</li>
                    <li>overview - calendar view with DnD for editablitiy</li>
                    <li>detailed view - editable single reservation for variables different than time and duration</li>
                </ul>
        </div>
    )
}

export default ReservationPage;
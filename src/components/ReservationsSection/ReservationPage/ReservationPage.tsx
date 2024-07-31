import React, { useState } from "react";
import RepeatingReservations from "../RepeatingReservations/RepeatingReservations";
import ReservationOverview from "../ReservationOverview/ReservationOverview";
import { useSelector } from "react-redux";
import { getAllReservations } from "../../../store/reducers/reservationsReducer";
import SelectedResDetails from "../SelectedResDetails/SelectedResDetails";
import { Reservation } from "../../../types/reservationTypes";
import { Table } from "../../../types/tableTypes";
import { getAllTables } from "../../../store/reducers/tablesReducer";
import { sortTables } from "../../../utils/sorting/sortTables";
import { Col, Row } from "react-bootstrap";

interface reservationPageProps {
    setDate: React.Dispatch<React.SetStateAction<Date>>;
    date: Date;
}

const ReservationPage:React.FC<reservationPageProps> = ({setDate, date}) => {

    const resListToday: Reservation[] = useSelector(getAllReservations);
    const [selectedRes, setSelectedRes] = useState<Reservation>(resListToday[0]);

    const tables: Table[] = useSelector(getAllTables);
    const sortedTables = sortTables(tables, "tableNumber");
    const tableNumbers = sortedTables.map((table) => table.tableNumber);

    return (
        <div className="my-4">
            <Row>
                <Col lg={2} xs={12}><RepeatingReservations chosenDate={date} setSelectedRes={setSelectedRes}/></Col>
                <Col lg={7} xs={12}><ReservationOverview setDate={setDate} setSelectedRes={setSelectedRes}/></Col>
                <Col lg={3} xs={12}><SelectedResDetails reservation={selectedRes} tableNumbers={tableNumbers}/></Col>
            </Row>            
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
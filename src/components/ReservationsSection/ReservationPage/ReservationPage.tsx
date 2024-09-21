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
                <Col lg={2} xs={12}>
                    <RepeatingReservations 
                        chosenDate={date} 
                        setSelectedRes={setSelectedRes}
                        selectedRes={selectedRes}
                        />
                </Col>
                <Col lg={7} xs={12}>
                    <ReservationOverview
                        setDate={setDate}
                        setSelectedRes={setSelectedRes}
                        selectedRes={selectedRes}
                        /></Col>
                <Col lg={3} xs={12}><SelectedResDetails reservation={selectedRes} tableNumbers={tableNumbers}/></Col>
            </Row>            
        </div>
    )
}

export default ReservationPage;
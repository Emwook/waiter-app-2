import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import TablesPage from "./components/TablesSection/TablesPage/TablesPage";
import Menu from "./components/SharedLayoutComponents/Menu/Menu";
import TableDetails from "./components/TablesSection/TableDetails/TableDetails";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Table } from "./types/tableTypes";
import { fetchAllTableData, getAllTables } from "./store/reducers/tablesReducer";
import ReservationPage from "./components/ReservationsSection/ReservationPage/ReservationPage";
import { formatDate } from "./utils/reservations/dateUtils";
import { fetchReservationsByDate } from "./store/reducers/reservationsReducer";
import { fetchAllProductData } from "./store/reducers/productReducer";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const {dateString: formattedDate} = formatDate(date);

  useEffect(() => {
    dispatch(fetchAllTableData() as any);
    dispatch(fetchReservationsByDate(formattedDate) as any);
    dispatch(fetchAllProductData() as any);
  }, [dispatch, formattedDate]);

  const tables: Table[] = useSelector(getAllTables);

  return (
    <main>
      <Menu />
      <Container>
        <Routes>
          <Route path="/" element={<TablesPage />} />
          <Route path="/reservations" element={<ReservationPage setDate={setDate} date={date}/>} />
          {tables.map((table: Table) => (
            <Route
              key={table.tableNumber}
              path={`/table/${table.tableNumber}`}
              element={<TableDetails tableNumber={table.tableNumber} />}
            />
          ))}
        </Routes>
      </Container>
    </main>
  );
};

export default App;

// src/App.tsx

import React, { useEffect } from "react";
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
import Login from "./components/AuthComponents/Login/Login";
import Signup from "./components/AuthComponents/Signup/Signup";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllTableData() as any);
  }, [dispatch]);

  const tables: Table[] = useSelector(getAllTables);

  return (
    <main>
      <Menu />
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<TablesPage />} />
          <Route path="/reservations" element={<ReservationPage />} />
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

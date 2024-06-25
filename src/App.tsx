// App.tsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Details from './components/Details/Details';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table } from './types/tableTypes';
import { fetchAllTableData, getAllTables } from './store/reducers/tablesReducer';
import ReservationPage from './components/ReservationPage/ReservationPage';
import { fetchAllReservationData } from './store/reducers/reservationsReducer';

const App: React.FC = () => {
  const dispatch = useDispatch();

  // Dispatch the setTables action when the data is loaded
  useEffect(() => {
      dispatch(fetchAllTableData() as any);
      dispatch(fetchAllReservationData() as any);
  }, [dispatch]);

  const tables: Table[] = useSelector(getAllTables);
  //const [tables, setTables] = useState<Table[]>(tablesData);

  return (
    <main>
      <Menu />
      <Container>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/reservations" element={<ReservationPage />} />
          {tables.map((table: Table) => (
            <Route
              key={table.tableNumber} // Assuming table has an id field
              path={`/table/${table.tableNumber}`}
              element={<Details tableNumber={table.tableNumber} />}
            />
          ))}
        </Routes>
      </Container>
    </main>
  );
};

export default App;

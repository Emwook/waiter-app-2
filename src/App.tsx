// App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { Container } from 'react-bootstrap';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Layout from './components/Layout/Layout';
import Details from './components/Details/Details';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table } from './types/tableTypes';
import { fetchAllTableData, getAllTables } from './store/reducers/tablesReducer';
import { sortTables } from './utils/sorting/sortTables';

const App: React.FC = () => {
  const dispatch = useDispatch();

  // Dispatch the setTables action when the data is loaded
  useEffect(() => {
      dispatch(fetchAllTableData() as any);
  }, [dispatch]);

  const tables: Table[] = useSelector(getAllTables);
  //const [tables, setTables] = useState<Table[]>(tablesData);

  return (
    <main>
      <Menu />
      <Container>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/layout" element={<Layout />} />
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

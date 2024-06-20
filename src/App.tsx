// App.tsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { Container } from 'react-bootstrap';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Layout from './components/Layout/Layout';
import Details from './components/Details/Details';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { setTables } from './store/actions/tablesActions';
import { AppState } from './store/store';
import { Table } from './types/tableTypes';
import { getAllTables } from './store/reducers/tablesReducer';

const App: React.FC = () => {
  const dispatch = useDispatch();

  // Use FirestoreConnect to fetch data from Firestore
  useFirestoreConnect([{ collection: 'tables' }]); // Adjust the collection name if necessary

  // Get the tables data from the Redux state
  const tables = useSelector(getAllTables);
  console.log('tables from firestore :   ', tables);

  // Dispatch the setTables action when the data is loaded
  useEffect(() => {
    if (isLoaded(tables) && !isEmpty(tables)) {
      dispatch(setTables(tables) as any); // Ensure tables type is correctly handled
    }
  }, [dispatch, tables]);

  return (
    <main>
      <Menu />
      <Container>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/layout" element={<Layout />} />
          {/*
          {tables.map((table: Table) => (
            <Route
              key={table.tableNumber} // Assuming table has an id field
              path={`/table/${table.tableNumber}`}
              element={<Details tableNumber={table.tableNumber} />}
            />
          ))}
          */}
        </Routes>
      </Container>
    </main>
  );
};

export default App;

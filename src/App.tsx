import { Routes, Route  } from 'react-router-dom';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Layout from './components/Layout/Layout';
import { Container } from 'react-bootstrap';
import Details from './components/Details/Details';
import 'bootstrap-icons/font/bootstrap-icons.css';
import useTables from './utils/store/useTables';

const App = () => {
  const { tables } = useTables(); 

  return (
    <main>
      <Menu/>
      <Container>
        <Routes>
            <Route path="/*" element={<Home/>}/>
            <Route path="/layout" element={<Layout/>}/>
            {tables.map(table => <Route
              path={`/table/${table.tableNumber}`}
              element={<Details tableNumber={table.tableNumber}/>}
            /> )}
        </Routes>
      </Container>
    </main>
  );
}

export default App;

import { Routes, Route  } from 'react-router-dom';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Layout from './components/Layout/Layout';
import { Container } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';


const App = () => {
  return (
    <main>
      <Menu/>
      <Container>
        <Routes>
            <Route path="/*" element={<Home/>}/>
            <Route path="/layout" element={<Layout/>}/>
        </Routes>
      </Container>
    </main>
  );
}

export default App;

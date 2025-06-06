import React from "react";
import { Container, Navbar} from "react-bootstrap";
import { NavLink } from 'react-router-dom';

const Menu:React.FC = () =>{
    return(
        <Container>
        <Navbar expand="lg" bg="primary" className=" rounded-3 text-light lead h1 mt-1 px-4 mb-2 d-flex justify-content-between">
            <Navbar.Brand className="text-light p-2">Waiter-app</Navbar.Brand>
            <div>
                <Navbar.Brand className="text-light">
                    <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>tables</NavLink>
                </Navbar.Brand>
                <Navbar.Brand className="text-light">
                    <NavLink to="/reservations" style={{ textDecoration: 'none', color: 'inherit' }}>reservations</NavLink>
                </Navbar.Brand>
            </div>
        </Navbar>
        </Container>
    );
}

export default Menu;
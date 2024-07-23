import React from "react";
import { Container, Navbar} from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { getUserEmail } from "../../../store/reducers/userReducer";

const Menu:React.FC = () =>{
    const userEmail = useSelector(getUserEmail);
    return(
        <Container>
        <Navbar expand="lg" bg="primary" className=" rounded-3 text-light lead h1 mt-1 px-4 mb-2 d-flex justify-content-between">
            <div>
            <Navbar.Brand className="text-light p-2">Waiter-app</Navbar.Brand>
            <Navbar.Brand className="text-dark mx-2"> {userEmail?"logged user:":""} {userEmail}</Navbar.Brand>
            </div>
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
import { Container, Spinner } from "react-bootstrap";
import React from "react";

const Loading: React.FC = () => {    
return (
    <Container className="d-flex justify-content-center align-items-start py-5">
        <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </Container>
);
}
export default Loading;
import React from "react";
import { Form } from "react-bootstrap";

const SelectBox:React.FC = () => {
    return(
        <Form className="mx-0 h5 h-100 d-flex justify-content-center align-content-center">
            <Form.Check type="checkbox" className="my-auto text-primary"/>
        </Form>
    )
}
export default SelectBox;
import React, {useState} from "react";
import { Row, Col, Button, Form } from 'react-bootstrap'
import StatusInput from "../StatusInput/StatusInput";
import PeopleInput from "../PeopleInput/PeopleInput";
import { Table } from "../../types/tableType";
import useNextTable from "../../utils/UseNextTable";
import { mostNumOfPeople, leastNumOfPeople } from "../../config/settings";
import { addNewTable } from "../../utils/addNewTable";
import { dispatchTableAddedEvent } from "../../utils/eventDispatcher";


const TableForm:React.FC = () =>{
    const newTable: Table = useNextTable();
    const [selectedStatus, setSelectedStatus] = useState<string>('free'); 
    const [displayedNumOfPeople, setDisplayedNumOfPeople] = useState<number>(0);
    const [displayedMaxNumOfPeople, setDisplayedMaxNumOfPeople] = useState<number>(1);
    const tableNumber = newTable.tableNumber;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        newTable.status = selectedStatus;
        newTable.numOfPeople = displayedNumOfPeople;
        newTable.maxNumOfPeople = displayedMaxNumOfPeople;
        addNewTable(newTable);
        dispatchTableAddedEvent(newTable);
    };

    const updateSelectedStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

    const updateDisplayedNumOfPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople) {
            if (targetValue <= displayedMaxNumOfPeople) {
                setDisplayedNumOfPeople(targetValue)
            }
            else {
                setDisplayedNumOfPeople(displayedMaxNumOfPeople);
            }
        }
    };

    const updateDisplayedMaxNumOfPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople) { 
            if (targetValue <= displayedNumOfPeople) {
                setDisplayedNumOfPeople(targetValue)
            }
            setDisplayedMaxNumOfPeople(targetValue);
        }
    };
    
    return(
        <Row className="text-dark px-5 my-5 py-4 justify-content-center bg-light d-flex align-items-center">
            <Col xs={12} className="d-flex justify-content-left">
                <Form onSubmit={handleSubmit}>
                    <StatusInput 
                        inDetailsComponent={false}
                        tableNumber={tableNumber}
                        updateSelectedStatus={updateSelectedStatus}/>
                    <PeopleInput 
                        tableNumber={tableNumber}  
                        updateDisplayedNumOfPeople={updateDisplayedNumOfPeople}
                        updateDisplayedMaxNumOfPeople={updateDisplayedMaxNumOfPeople}
                        displayedNumOfPeople={displayedNumOfPeople}
                        displayedMaxNumOfPeople={displayedMaxNumOfPeople}/>
                    <Button size="sm" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Col>
        </Row>
    )
}
export default TableForm
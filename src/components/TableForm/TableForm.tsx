import React, {useState} from "react";
import { Row, Col, Button, Form } from 'react-bootstrap'
import StatusInput from "../StatusInput/StatusInput";
import PeopleInput from "../PeopleInput/PeopleInput";
import { Table } from "../../types/tableType";
import useNextTable from "../../utils/UseNextTable";
import { mostNumOfPeople, leastNumOfPeople } from "../../config/settings";
import { addNewTable } from "../../utils/addNewTable";
import { useNavigate } from "react-router";

interface TableFormProps {
}

const TableForm:React.FC<TableFormProps> = () =>{
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
        //window.location.reload(); // needs work to correctly update homepage to show the new table
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
        <li>
            <Row className="text-dark py-4 px-3 d-flex justify-content-between align-items-center">
                <Col xs={12} className="d-flex justify-content-center">
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
        </li>
    )
}
export default TableForm
import React, { useState } from "react";
import { Row, Col, Button, Form } from 'react-bootstrap';
import StatusInput from "../StatusInput/StatusInput";
import PeopleInput from "../PeopleInput/PeopleInput";
import { Table, TableStatus } from "../../types/tableTypes";
import useNextTable from "../../utils/sorting/useNextTable";
import { mostNumOfPeople, leastNumOfPeople, defaultNewTable } from "../../config/settings";
import { useDispatch } from "react-redux";
import { requestTableAdd } from "../../store/reducers/tablesReducer";

const TableForm: React.FC = () => {
    const dispatch = useDispatch();
    const newTable: Table = defaultNewTable;
    const [selectedStatus, setSelectedStatus] = useState<TableStatus>(newTable.status); 
    const [displayedNumOfPeople, setDisplayedNumOfPeople] = useState<number>(newTable.numOfPeople);
    const [displayedMaxNumOfPeople, setDisplayedMaxNumOfPeople] = useState<number>(newTable.maxNumOfPeople);
    const nextTable: Table = useNextTable();
    const nextTableNumber = nextTable.tableNumber;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTable: Table = {
            bill: 0,
            tableNumber: nextTableNumber,
            status: selectedStatus,
            numOfPeople: displayedNumOfPeople,
            maxNumOfPeople: displayedMaxNumOfPeople,
            combinedWith: []
        };
        dispatch(requestTableAdd(newTable) as any);
    };

    const updateSelectedStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value as TableStatus);
    };

    const updateDisplayedNumOfPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople) {
            if (targetValue <= displayedMaxNumOfPeople) {
                setDisplayedNumOfPeople(targetValue);
            } else {
                setDisplayedNumOfPeople(displayedMaxNumOfPeople);
            }
        }
    };

    const updateDisplayedMaxNumOfPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople) {
            if (targetValue <= displayedNumOfPeople) {
                setDisplayedNumOfPeople(targetValue);
            }
            setDisplayedMaxNumOfPeople(targetValue);
        }
    };
    
    return (
        <Col xs={6}>
            <Row className="text-dark mx-1 mt-4 mb-5 p-3 justify-content-center bg-light d-flex align-items-center border-bottom border-dark">
                <Col xs={12} className="d-flex justify-content-left">
                    <Form onSubmit={handleSubmit}>
                        <Row className="my-2">
                            <Col xs={4}><span className="h2">Table {nextTableNumber}</span></Col>
                            <StatusInput
                                inDetailsComponent={false}
                                table={nextTable}
                                updateSelectedStatus={updateSelectedStatus}/>
                            <PeopleInput   
                                table={nextTable}
                                updateDisplayedNumOfPeople={updateDisplayedNumOfPeople}
                                updateDisplayedMaxNumOfPeople={updateDisplayedMaxNumOfPeople}
                                displayedNumOfPeople={displayedNumOfPeople}
                                displayedMaxNumOfPeople={displayedMaxNumOfPeople}/>
                            <Button size="sm" variant="primary" type="submit">
                                add table
                            </Button>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Col>
    );
};

export default TableForm;

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
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople && selectedStatus === 'busy') {
            if (targetValue <= displayedMaxNumOfPeople) {
                setDisplayedNumOfPeople(targetValue);
            } else {
                setDisplayedNumOfPeople(displayedMaxNumOfPeople);
            }
        }
        else {
            setDisplayedNumOfPeople(0);
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
        <div className={`border rounded border-dark`}> 
            <Row className="`mt-1 pb-1 pt-4 px-3 d-flex justify-content-between align-items-center">
                <Col xs={12} className="border-bottom border-dark">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={2}><span className="h2">Table {nextTableNumber}</span></Col>
                            <Col xs={4}>
                                <StatusInput
                                    inDetailsComponent={false}
                                    table={nextTable}
                                    updateSelectedStatus={updateSelectedStatus}
                                    selectedStatus={selectedStatus}
                                />
                            </Col>
                            <Col xs={4}>
                                <PeopleInput   
                                    table={nextTable}
                                    selectedStatus={selectedStatus}
                                    updateDisplayedNumOfPeople={updateDisplayedNumOfPeople}
                                    updateDisplayedMaxNumOfPeople={updateDisplayedMaxNumOfPeople}
                                    displayedNumOfPeople={displayedNumOfPeople}
                                    displayedMaxNumOfPeople={displayedMaxNumOfPeople}/>
                                </Col>
                            <Col className="d-flex justify-content-end align-content-center">
                                <Button size="lg" variant="primary" type="submit" className="py-1 my-auto border-light text-right ml-auto">
                                    <i className="bi bi-plus"/>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default TableForm;

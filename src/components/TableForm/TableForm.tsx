import React, {useState} from "react";
import { Row, Col, Button, Form } from 'react-bootstrap'
import StatusInput from "../StatusInput/StatusInput";
import PeopleInput from "../PeopleInput/PeopleInput";
import { Table } from "../../types/tableType";
import useNextTable from "../../utils/sorting/useNextTable";
import { mostNumOfPeople, leastNumOfPeople, defaultNewTable } from "../../config/settings";
import { addNewTable } from "../../utils/store/addNewTable";
import { dispatchTableAddedEvent } from "../../utils/events/eventDispatcher";
import useTables from "../../utils/store/useTables";

const TableForm: React.FC = () => {
    const newTable: Table = defaultNewTable;
    const { tables, loadingTables } = useTables();
    const [selectedStatus, setSelectedStatus] = useState<string>(newTable.status); 
    const [displayedNumOfPeople, setDisplayedNumOfPeople] = useState<number>(newTable.numOfPeople);
    const [displayedMaxNumOfPeople, setDisplayedMaxNumOfPeople] = useState<number>(newTable.maxNumOfPeople);
    const { nextTable, loadingNextTable } = useNextTable();
    const nextTableNumber = nextTable.tableNumber;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        newTable.status = selectedStatus;
        newTable.numOfPeople = displayedNumOfPeople;
        newTable.maxNumOfPeople = displayedMaxNumOfPeople;
        !loadingNextTable?(newTable.tableNumber = nextTableNumber):(newTable.tableNumber = tables.length);
        console.log('adding new table!');
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
        <Col xs={6}>
        <Row className="text-dark mx-1 mt-4 mb-5 p-3 justify-content-center bg-light d-flex align-items-center border-bottom border-dark">
            <Col xs={12} className="d-flex justify-content-left">
                <Form onSubmit={handleSubmit}>
                    <Row className="my-2">
                        <Col xs={12}><span className="h2">Table {nextTableNumber}</span></Col>
                    </Row>
                    <StatusInput
                        inDetailsComponent={false}
                        tableNumber={!loadingNextTable?(nextTableNumber):(tables.length)}
                        updateSelectedStatus={updateSelectedStatus}/>
                    <PeopleInput   
                        tableNumber={!loadingNextTable?(nextTableNumber):(tables.length)}
                        updateDisplayedNumOfPeople={updateDisplayedNumOfPeople}
                        updateDisplayedMaxNumOfPeople={updateDisplayedMaxNumOfPeople}
                        displayedNumOfPeople={displayedNumOfPeople}
                        displayedMaxNumOfPeople={displayedMaxNumOfPeople}/>
                    {(!loadingNextTable || !loadingTables) && (
                        <Button size="sm" variant="primary" type="submit">
                            add table
                        </Button>
                    )}
                </Form>
            </Col>
        </Row>
        </Col>
    )
}
export default TableForm
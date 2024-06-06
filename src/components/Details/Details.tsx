import React, { useState, useEffect } from "react";
import { Form, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useTableByNumber from "../../utils/store/useTableByNumber";
import StatusInput from "../StatusInput/StatusInput";
import { updateTable } from "../../utils/store/UpdateTable";
import PeopleInput from "../PeopleInput/PeopleInput";
import Loading from "../Loading/Loading";
import { mostNumOfPeople, leastNumOfPeople, maxBill } from "../../config/settings";
import BillInput from "../BillInput/BillInput";

interface DetailsProps {
    tableNumber: number;
}

const Details: React.FC<DetailsProps> = ({ tableNumber }) => {    
    const navigate = useNavigate();
    const table = useTableByNumber(tableNumber);
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedStatus, setSelectedStatus] = useState<string>('busy'); 
    const [displayedNumOfPeople, setDisplayedNumOfPeople] = useState<number>(0);
    const [displayedMaxNumOfPeople, setDisplayedMaxNumOfPeople] = useState<number>(1); 
    const [displayedBill, setDisplayedBill] = useState<number>(0); 

    useEffect(() => {
        if (table) {
            setSelectedStatus(table.status || 'busy');
            setDisplayedNumOfPeople(table.numOfPeople || 0);
            setDisplayedMaxNumOfPeople(table.maxNumOfPeople || 0);
            setDisplayedBill(table.bill || 0);
            setLoading(false);
        }
    }, [table]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateTable(tableNumber, { status: selectedStatus, numOfPeople: displayedNumOfPeople, maxNumOfPeople: displayedMaxNumOfPeople, bill: displayedBill });
        navigate('/');
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

    const updateDisplayedBill = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (!isNaN(targetValue) && targetValue <= maxBill) {
            setDisplayedBill(targetValue);
        }
    };

    if (loading) {
        return <Loading/>
    }
    
    return (
        <Container>
            <h1 className="py-4">Table {table?.tableNumber}</h1>
            <Form onSubmit={handleSubmit}>
                <StatusInput
                    inDetailsComponent={true}
                    tableNumber={tableNumber}
                    updateSelectedStatus={updateSelectedStatus}/>
                <PeopleInput
                    tableNumber={tableNumber}  
                    updateDisplayedNumOfPeople={updateDisplayedNumOfPeople}
                    updateDisplayedMaxNumOfPeople={updateDisplayedMaxNumOfPeople}
                    displayedNumOfPeople={displayedNumOfPeople}
                    displayedMaxNumOfPeople={displayedMaxNumOfPeople}/>
                <BillInput
                    tableNumber={tableNumber} 
                    displayedBill={displayedBill}
                    updateDisplayedBill={updateDisplayedBill}/>
                <Button size="sm" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Details;

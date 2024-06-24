import React, { useState } from "react";
import { Col } from 'react-bootstrap';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { checkSelectMode, enterSelect, getSelected } from "../../store/reducers/selectModeReducer";
import { Table } from "../../types/tableTypes";
import { requestTableCombined, getAllTables } from "../../store/reducers/tablesReducer";
import combineTables from "../../utils/store/combineTables";

const SelectModeButton: React.FC = () => {
    const dispatch = useDispatch();
    const [selectMode, setSelectMode] = useState<boolean>(useSelector(checkSelectMode));
    const selectedTables: Table[] = useSelector(getSelected);
    const tableList = useSelector(getAllTables);

    const toggleSelect = () => {
        setSelectMode(!selectMode);
        dispatch(enterSelect() as any);
    }

    const handleCombine = () => {
        toggleSelect();
        if (selectedTables.length === 2) {
            const table1 = selectedTables[0];
            const table2 = selectedTables[1];
            if (table1 && table2) {
                const tablesToCombine: Table[] = combineTables(table1, table2, tableList);
                tablesToCombine.forEach(table => {
                    dispatch(requestTableCombined(table) as any);
                });
            }
        }
        //dispatch(enterSelect() as any);;
    };    

    const handleRemove = () => {
        console.log(selectMode);
    };

    return (
            <Col xs={2} className="mt-4">
                {(selectMode) && (
                    <>
                    <Button variant='success' className={`border mx-1 ${selectMode?'border-light':'border-primary'}`} onClick={handleCombine} >
                        <i className="bi bi-link"></i>
                    </Button>
                    <Button variant='warning' className={`border mx-1 ${selectMode?'border-light':'border-primary'}`}>
                    <i className="bi bi-x-square"></i>
                    </Button>
                    <Button variant='danger' className={`border mx-1 ${selectMode?'border-light':'border-primary'}`} onClick={handleRemove}>
                        <i className="bi bi-trash"></i>
                    </Button>
                    </>
                )}
                <Button className={`ml-3 border ${selectMode?'border-light':'border-primary'}`} variant={selectMode?'primary':'light'} onClick={toggleSelect}>
                    Select
                </Button>
            </Col>
    );
};

export default SelectModeButton;

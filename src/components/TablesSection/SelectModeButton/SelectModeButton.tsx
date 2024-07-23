import React from "react";
import { Col } from 'react-bootstrap';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { checkSelectMode, enterSelect, getSelected } from "../../../store/reducers/selectModeReducer";
import { Table } from "../../../types/tableTypes";
import { requestTableCombined, getAllTables, requestTableRemove } from "../../../store/reducers/tablesReducer";
import combineTables from "../../../utils/combining/combineTables";

const SelectModeButton: React.FC = () => {
    const dispatch = useDispatch();
    const selectMode = useSelector(checkSelectMode);
    const selectedTables: Table[] = useSelector(getSelected);
    const tableList = useSelector(getAllTables);

    const toggleSelect = () => {
        dispatch(enterSelect() as any);
    }

    const handleCombine = () => {
        if (selectedTables.length > 1) {
            const tablesToCombine: Table[] = combineTables(selectedTables, tableList);
            tablesToCombine.forEach(table => {
                dispatch(requestTableCombined(table) as any);
            });
        }
        dispatch(enterSelect() as any);
    };    

    const handleRemove = () => {
        selectedTables.forEach(table => {
            dispatch(requestTableRemove(table) as any);
        });
        dispatch(enterSelect() as any);
    };

    return (
        <Col className="mt-4 d-flex justify-content-end">
            {selectMode && (
                <>
                    <Button variant='success' className={`border mx-1 ${selectMode ? 'border-light' : 'border-primary'}`} onClick={handleCombine} >
                        <i className="bi bi-link"></i>
                    </Button>
                    <Button variant='danger' className={`border mx-1 ${selectMode ? 'border-light' : 'border-primary'}`} onClick={handleRemove}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </>
            )}
            <Button className={`ml-3 border ${selectMode ? 'border-light' : 'border-primary'}`} variant={selectMode ? 'primary' : 'light'} onClick={toggleSelect}>
                Select
            </Button>
            
        </Col>
    );
};

export default SelectModeButton;

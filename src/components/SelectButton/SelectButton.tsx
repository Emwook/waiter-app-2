import React, { useEffect, useState } from "react";
import { Col } from 'react-bootstrap';
import { Button } from "react-bootstrap";
import { Table } from "../../types/tableTypes";
//import { dispatchGroupingMethodEvent } from "../../utils/events/eventDispatcher";

interface SelectButtonProps {
    selectMode: boolean;
    setSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectButton: React.FC<SelectButtonProps> = ({ selectMode, setSelectMode }) => {
    const [selectedTables, setSelectedTables] =useState<Table[]>([]);

    useEffect(() => {
        const handleSelectedTables = (event: CustomEvent<{ table: Table }>) => {
            if(selectedTables.includes(event.detail.table as Table)){
                setSelectedTables(selectedTables.filter(table => table.tableNumber !== event.detail.table.tableNumber));
            }
            else {
                setSelectedTables([...selectedTables, (event.detail.table)]);
            }
        };
        window.addEventListener('selectedTable', handleSelectedTables as EventListener);
    
        return () => {
          window.removeEventListener('selectedTable', handleSelectedTables as EventListener);
        };
      });

    //from combineTablesForm for handleCombine:
    /*
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedTables.length === 2) {
            const table1 = tableList.find(table => table.tableNumber === selectedTables[0]);
            const table2 = tableList.find(table => table.tableNumber === selectedTables[1]);
            if (table1 && table2) {
                combineTables(table1, table2, tableList);
                dispatchCombinedTablesEvent([table1, table2]);
            }
        } else {
            console.log("Please select two tables to combine.");
        }
        };
    */

    const handleCombine = () => {
        console.log(selectedTables);
    };

    //similar to handleCombine should be implementedinto handleCombine
    const handleDecombine = () => {
        console.log(selectedTables);
    }; 
    //from RemoveTable for handleRemove
    /*
    const handleRemove = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        removeSelectedTable(tableToRemove);
        dispatchTableRemovedEvent(tableToRemove);
    }; 
    */

    const handleRemove = () => {
        console.log(selectedTables);
    };

    return (
            <Col xs={6} className="mt-4 d-flex justify-content-end">
                {(selectMode) && (
                    <>
                    <Button variant='success' className={`border mx-1 ${selectMode?'border-light':'border-primary'}`} onClick={handleCombine} >
                        <i className="bi bi-link"></i>
                    </Button>
                    <Button variant='warning' className={`border mx-1 ${selectMode?'border-light':'border-primary'}`} onClick={handleDecombine}>
                    <i className="bi bi-x-square"></i>
                    </Button>
                    <Button variant='danger' className={`border mx-1 ${selectMode?'border-light':'border-primary'}`} onClick={handleRemove}>
                        <i className="bi bi-trash"></i>
                    </Button>
                    </>
                )}
                <Button className={`ml-3 border ${selectMode?'border-light':'border-primary'}`} variant={selectMode?'primary':'light'} onClick={e => setSelectMode(!selectMode)}>
                    Select
                </Button>
            </Col>
    );
};

export default SelectButton;

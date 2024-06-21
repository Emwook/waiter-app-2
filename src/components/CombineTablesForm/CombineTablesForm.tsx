import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form } from 'react-bootstrap';
import useTables from "../../utils/store/useTables";
import { Table } from "../../types/tableTypes";
import combineTables from "../../utils/store/combineTables";
import { dispatchCombinedTablesEvent } from "../../utils/events/eventDispatcher";
import { useSelector } from "react-redux";
import { getAllTables } from "../../store/reducers/tablesReducer";

const CombineTablesForm: React.FC = () => {
    const tables: Table[] = useSelector(getAllTables);
    const [selectedTables, setSelectedTables] = useState<number[]>([]);
    const [tableOptions, setTableOptions] = useState<Table[][]>([[], []]);

    // useEffect(() => {
    //     if (!loadingTables && tables.length > 0) {
    //         setTableOptions([tables, tables]);
    //     }
    // }, [loadingTables, tables]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedTables.length === 2) {
            const table1 = tables.find((table: Table) => table.tableNumber === selectedTables[0]);
            const table2 = tables.find((table: Table) => table.tableNumber === selectedTables[1]);
            if (table1 && table2) {
                combineTables(table1, table2, tables);
                dispatchCombinedTablesEvent([table1, table2]);
            }
        } else {
            console.log("Please select two tables to combine.");
        }
    };

    const handleTableSelect = (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTableNumber = parseInt(e.target.value);
        setSelectedTables(prevSelected => {
            const updatedSelected = [...prevSelected];
            updatedSelected[index] = selectedTableNumber;
            return updatedSelected;
        });

        // Update options for the other select box to exclude the selected option
        setTableOptions(prevOptions => {
            const updatedOptions = [...prevOptions];
            updatedOptions[index === 0 ? 1 : 0] = prevOptions[index === 0 ? 1 : 0].filter((table: Table) => table.tableNumber !== selectedTableNumber);
            return updatedOptions;
        });
    };

    return (
        <Col xs={6}>
            <Row className="text-dark mx-1 mt-4 mb-5 p-3 justify-content-center bg-light d-flex align-items-center border-bottom border-dark">
                <Col xs={12} className="d-flex justify-content-left">
                    <Form onSubmit={handleSubmit}>
                            <Row className="my-2">
                                <Col xs={12}><span className="h2">Combine tables</span></Col>
                            </Row>
                            <Row className="my-2"> 
                                <Col xs={8}>
                                <Form.Select
                                name="combine1" data-bs-theme="light"
                                size="sm" className="border-dark"
                                onChange={handleTableSelect(0)}>
                                <option>Select Table 1</option>
                                {tableOptions[0].length > 0 ? (
                                    tableOptions[0].map((table: Table) =>
                                        <option
                                            key={table.tableNumber}
                                            value={table.tableNumber}>
                                            Table {table.tableNumber}
                                        </option>
                                    )
                                ) : (
                                    <option disabled>No tables available</option>
                                )}
                                </Form.Select>
                                </Col>                       
                            </Row>
                            <Row className="my-2"> 
                                <Col xs={8}>
                                    <Form.Select
                                        name="combine2" data-bs-theme="light"
                                        size="sm" className="border-dark"
                                        onChange={handleTableSelect(1)}>
                                        <option>Select Table 2</option>
                                        {tableOptions[1].length > 0 ? (
                                            tableOptions[1].map((table: Table) =>
                                                <option
                                                    key={table.tableNumber}
                                                    value={table.tableNumber}>
                                                    Table {table.tableNumber}
                                                </option>
                                            )
                                        ) : (
                                            <option disabled>No tables available</option>
                                        )}
                                    </Form.Select>
                                </Col>
                            </Row>
                        <Button size="sm" variant="primary" type="submit">
                            join tables
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Col>
    );
}

export default CombineTablesForm;

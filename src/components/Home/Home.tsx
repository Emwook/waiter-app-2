import React, { useState, useEffect } from "react";
import { Table } from "../../types/tableType";
import TableBar from "../TableBar/TableBar";
import useTables from "../../utils/store/useTables";
import Loading from "../Loading/Loading";
import TableForm from "../TableForm/TableForm";
import SortingPanel from "../SortingPanel/SortingPanel";
import { defaultSortingMethod } from "../../config/settings";
import useNextTable from "../../utils/sorting/useNextTable";
import { Row } from "react-bootstrap";
import CombineTablesForm from "../CombineTablesForm/CombineTablesForm";
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { sortTables } from "../../utils/sorting/sortTables";
import combineTables from "../../utils/store/combineTables";
import { dispatchCombinedTablesEvent } from "../../utils/events/eventDispatcher";

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { loadingNextTable } = useNextTable();
  const { tables: tablesData, loadingTables } = useTables();
  const [tables, setTables] = useState<Table[]>(tablesData);
  const [sortingMethod, setSortingMethod] = useState<keyof Table>(defaultSortingMethod);

  useEffect(() => {
    if (loadingTables || loadingNextTable) {
      setLoading(true);
    } else {
      setTables(sortTables(tablesData,sortingMethod));
      setLoading(false);
    }
  }, [loadingTables, loadingNextTable, sortingMethod, tablesData]);

  useEffect(() => {
    const handleTableAdded = (event: CustomEvent<{ table: Table }>) => {
      setTables((prevTables) => [...prevTables, event.detail.table]);
    };

    window.addEventListener('tableAdded', handleTableAdded as EventListener);

    return () => {
      window.removeEventListener('tableAdded', handleTableAdded as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleTableRemoved = (event: CustomEvent<{ table: Table }>) => {
      setTables((prevTables) => prevTables.filter(table => table.tableNumber !== event.detail.table.tableNumber));
    };

    window.addEventListener('tableRemoved', handleTableRemoved as EventListener);

    return () => {
      window.removeEventListener('tableRemoved', handleTableRemoved as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleSortingMethodChange = (event: CustomEvent<{ method: keyof Table }>) => {
      setSortingMethod(event.detail.method);
    };
    window.addEventListener('methodChanged', handleSortingMethodChange as EventListener);

    return () => {
      window.removeEventListener('methodChanged', handleSortingMethodChange as EventListener);
    };
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination, combine } = result;

    if (combine) {
      const sourceTable = tables[source.index];
      const destinationTable = tables.find(table => table.tableNumber === parseInt(combine.draggableId));

      if (sourceTable && destinationTable) {
        const combinedTables = combineTables(sourceTable, destinationTable, tables);
        setTables(combinedTables);
        dispatchCombinedTablesEvent([sourceTable, destinationTable]);
      }
      return;
    }

    if (!destination) {
      return;
    }

    const reorderedTables = Array.from(tables);
    const [removed] = reorderedTables.splice(source.index, 1);
    reorderedTables.splice(destination.index, 0, removed);

    setTables(reorderedTables);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <SortingPanel sortingMethod={sortingMethod} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tables" isCombineEnabled>
          {(provided) => (
              <div 
                ref={provided.innerRef} 
                {...provided.droppableProps}
                className="my-4"
              >
                {tables.map((table, index) => (<TableBar Table={table} index={index} />))}
                {provided.placeholder}
              </div>
            )}
        </Droppable>
      </DragDropContext>
      <Row>
        <TableForm />
        <CombineTablesForm />
      </Row>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { GroupingMethod, Table } from "../../types/tableTypes";
import useTables from "../../utils/store/useTables";
import Loading from "../Loading/Loading";
import TableForm from "../TableForm/TableForm";
import SortingPanel from "../SortingPanel/SortingPanel";
import { defaultGroupingMethod, defaultSortingMethod } from "../../config/settings";
import useNextTable from "../../utils/sorting/useNextTable";
import { Row } from "react-bootstrap";
//import CombineTablesForm from "../CombineTablesForm/CombineTablesForm";
//import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { sortTables } from "../../utils/sorting/sortTables";
//import combineTables from "../../utils/store/combineTables";
//import { dispatchCombinedTablesEvent } from "../../utils/events/eventDispatcher";
import TableGroup from "../TableGroup/TableGroup";
import GroupingPanel from "../GroupingPanel/GroupingPanel";
import { getCombinedTables } from "../../utils/sorting/getCombinedTables";

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { loadingNextTable } = useNextTable();
  const { tables: tablesData, loadingTables } = useTables();
  const [tables, setTables] = useState<Table[]>(tablesData);
  const [sortingMethod, setSortingMethod] = useState<keyof Table>(defaultSortingMethod);
  const [groupingMethod, setGroupingMethod] = useState<GroupingMethod>(defaultGroupingMethod);

  useEffect(() => {
    if (loadingTables || loadingNextTable) {
      setLoading(true);
    } else {
      setTables(sortTables(tablesData, sortingMethod));
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
    window.addEventListener('sortingMethodChanged', handleSortingMethodChange as EventListener);

    return () => {
      window.removeEventListener('sortingMethodChanged', handleSortingMethodChange as EventListener);
    };
  });

  useEffect(() => {
    const handleGroupingMethodChange = (event: CustomEvent<{ method: GroupingMethod }>) => {
      setGroupingMethod(event.detail.method);
      console.log('group method changed!')
    };
    window.addEventListener('groupingMethodChanged', handleGroupingMethodChange as EventListener);

    return () => {
      window.removeEventListener('groupingMethodChanged', handleGroupingMethodChange as EventListener);
    };
  });
/*
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
    console.log(reorderedTables);
    setTables(reorderedTables);
  }; */

  if (loading) {
    return <Loading />;
  }

  const combinedTableGroups = getCombinedTables(tables);
  const singleTables = combinedTableGroups.filter(group => group.length === 1).flat();
  const groupedTables = combinedTableGroups.filter(group => group.length > 1);


  return (
    <div>
      <Row>
        <SortingPanel sortingMethod={sortingMethod} />
        <GroupingPanel groupingMethod={groupingMethod}/>
      </Row>
      {/*<DragDropContext onDragEnd={onDragEnd}> */}
        {groupingMethod === 'none' ? (      
          <TableGroup tables={tables} groupType='none' />
        ) : (
          <>
            {groupedTables.map((group, index) => (
              <TableGroup key={`group-${index}`} tables={group} groupType='combined' />
            ))}
            {singleTables.length > 0 && (
              <TableGroup tables={singleTables} groupType='none' />
            )}
          </>
        )}
      {/*</DragDropContext>*/}
      <Row>
        <TableForm />
        {/*<CombineTablesForm />*/}
      </Row>
    </div>
  );
};

export default Home;

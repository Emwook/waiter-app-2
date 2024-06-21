import React, { useState, useEffect } from "react";
import { GroupingMethod, Table } from "../../types/tableTypes";
//import useTables from "../../utils/store/useTables";
import Loading from "../Loading/Loading";
import TableForm from "../TableForm/TableForm";
import SortingPanel from "../SortingPanel/SortingPanel";
import { defaultGroupingMethod, defaultSortingMethod } from "../../config/settings";
//import useNextTable from "../../utils/sorting/useNextTable";
import { Row } from "react-bootstrap";
//import CombineTablesForm from "../CombineTablesForm/CombineTablesForm";
//import { DragDropContext, DropResult } from 'react-beautiful-dnd';
//import { sortTables } from "../../utils/sorting/sortTables";
//import combineTables from "../../utils/store/combineTables";
//import { dispatchCombinedTablesEvent } from "../../utils/events/eventDispatcher";
import TableGroup from "../TableGroup/TableGroup";
import GroupingPanel from "../GroupingPanel/GroupingPanel";
import { getCombinedTables } from "../../utils/sorting/getCombinedTables";
import { getSortedTables } from "../../utils/sorting/getSortedTables";
import SelectButton from "../SelectButton/SelectButton";
import { useSelector } from "react-redux";
import { addTable, getAllTables, requestTableAdd } from "../../store/reducers/tablesReducer";
import { sortTables } from "../../utils/sorting/sortTables";
import { useDispatch } from "react-redux";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  //const { loadingNextTable } = useNextTable();
  const tables: Table[] = useSelector(getAllTables);
  const [sortingMethod, setSortingMethod] = useState<keyof Table>(defaultSortingMethod);
  const [groupingMethod, setGroupingMethod] = useState<GroupingMethod>(defaultGroupingMethod);
  const [selectMode, setSelectMode] = useState<boolean>(false);

  // useEffect(() => {
  //   if (loadingNextTable) {
  //     setLoading(true);
  //   } else {
  //     setTables(sortTables(tablesData, sortingMethod));
  //     setLoading(false);
  //   }
  // }, [ loadingNextTable, sortingMethod, tablesData]);

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
  const statusTableGroups = getSortedTables(tables);
  const singleTables = combinedTableGroups.filter(group => group.length === 1).flat()
  const groupedTables = (groupingMethod === 'combined')
                        ?combinedTableGroups.filter(group => group.length > 1)
                        :statusTableGroups;


  return (
    <div>
      <Row>
        <SortingPanel sortingMethod={sortingMethod} />
        <GroupingPanel groupingMethod={groupingMethod}/>
        <SelectButton selectMode={selectMode} setSelectMode={setSelectMode}/>
      </Row>
      <div>
      {/*<DragDropContext onDragEnd={onDragEnd}> */}
        {groupingMethod === 'none' ? (      
          <TableGroup tables={tables} groupingMethod='none' selectMode={selectMode}/>
        ) : ((groupingMethod === 'combined')?(
          <>
            {groupedTables.map((group, index) => (
              <TableGroup key={`group-${index}`} tables={group} groupingMethod='combined' selectMode={selectMode}/>
            ))}
            {singleTables.length > 0 && (
              <TableGroup tables={singleTables} groupingMethod='none' selectMode={selectMode}/>
            )}
          </>)
          :(
            <>
            {groupedTables.map((group, index) => (
              <TableGroup key={`group-${index}`} tables={group} groupingMethod='status' selectMode={selectMode}/>
            ))}
          </>)
          )
        }
      </div>
      {/*</DragDropContext>*/}
      <Row>
        <TableForm />
        {/*<CombineTablesForm />*/}
      </Row>
    </div>
  );
};

export default Home;

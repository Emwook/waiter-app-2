import React from "react";
import { GroupingMethod, Table } from "../../types/tableTypes";
//import { Droppable } from "react-beautiful-dnd";
import TableBar from "../TableBar/TableBar";
//import { Col } from "react-bootstrap";

interface TableGroupProps {
    tables: Table[];
    groupingMethod: GroupingMethod;
    selectMode: boolean;
}

const TableGroup:React.FC<TableGroupProps> = ({groupingMethod, tables, selectMode}) =>{
  let borderStyle: string = 'border-dark';
  if(groupingMethod === 'status'){
  switch( tables[0].status){
    case 'busy':
      borderStyle = 'border-danger';
      break;
    case 'free':
      borderStyle = 'border-success';
      break;
    case 'reserved':
      borderStyle = 'border-warning';
      break;
    case 'cleaning':
      borderStyle = 'border-info';
      break;
    default:
        break;
    }
  }
    return(
      <div className={`p-1 mx-1 my-4 border rounded ${borderStyle}`}> 
        {tables.map((table, index) => (
          <TableBar Table={table} index={index} 
          inGroupByStatus={(groupingMethod === 'status')?true:false}
          selectMode={selectMode} />))}
      </div>
       )
      }
        /*<Droppable droppableId={`group-${tables[0]}`} >
          {(provided) => (
              <div> 
                {/* ref={provided.innerRef} 
                {...provided.droppableProps}
                className={`p-1 my-4 border-dark border`}
                {tables.map((table, index) => (<TableBar Table={table} index={index} />))}
                {/*{provided.placeholder}
              </div>
             )}
       </Droppable>*/


export default TableGroup;
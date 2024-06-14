import React from "react";
import { GroupOption, Table } from "../../types/tableTypes";
import { Droppable } from "react-beautiful-dnd";
import TableBar from "../TableBar/TableBar";

interface TableGroupProps {
    tables: Table[];
    groupType: GroupOption;
}

const TableGroup:React.FC<TableGroupProps> = ({groupType, tables}) =>{
    return(
        <Droppable droppableId={`group-${tables[0]}`} isCombineEnabled>
          {(provided) => (
              <div 
                ref={provided.innerRef} 
                {...provided.droppableProps}
                className={`p-1 my-4 border-dark border`}
              >
                {tables.map((table, index) => (<TableBar Table={table} index={index} />))}
                {provided.placeholder}
              </div>
            )}
        </Droppable>
    )
}

export default TableGroup;
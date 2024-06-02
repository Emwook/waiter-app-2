import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { Table } from "../../types/tableType";
import TableBar from "../TableBar/TableBar";
import useTables from "../../utils/useTables";
import Loading from "../Loading/Loading";
import TableForm from "../TableForm/TableForm";

const Home:React.FC = () => {
    const tables: Table[] = useTables();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (tables) {
            setLoading(false);
        }
    }, [tables]);

    const handleOnDragEnd = (result: DropResult) => {
        // TODO: Implement combination logic here
        console.log('Drag end result:', result);
    };

    if (loading) {
        return <Loading/>
    }
    return(
        <div>
       <DragDropContext onDragEnd={handleOnDragEnd}>
           <Droppable droppableId='tables'>
               {(provided) => (
                   <ul className="mt-5 px-3 list-unstyled" ref={provided.innerRef} {...provided.droppableProps}>
                       {tables.map((table, index) => (
                           <Draggable key={table.id} draggableId={table.id} index={table.tableNumber}>
                               {(provided) => (
                                   <li ref={provided.innerRef}
                                    {...provided.draggableProps} 
                                    {...provided.dragHandleProps}
                                    >
                                       <TableBar Table={table} key={table.id} />
                                   </li>
                               )}
                           </Draggable>
                       ))}
                       {provided.placeholder}
                   </ul>
               )}
           </Droppable>
        </DragDropContext>
        <TableForm/>
       </div>
    );
}

export default Home;

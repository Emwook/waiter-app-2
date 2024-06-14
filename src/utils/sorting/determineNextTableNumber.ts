import { Table } from "../../types/tableTypes";

export const determineNextTableNumber = (sortedTables: Table[]) => {
    for (let i = 0; i < sortedTables.length - 1; i++) {
        if ((sortedTables[i + 1].tableNumber - sortedTables[i].tableNumber) > 1) {
            return sortedTables[i].tableNumber + 1;
        }
    }
    return sortedTables[sortedTables.length - 1].tableNumber + 1;
};

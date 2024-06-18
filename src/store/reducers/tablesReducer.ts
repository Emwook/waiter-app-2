import { Table } from "../../types/tableTypes";
import { ADD_TABLE, CHANGE_TABLE_DETAILS, REMOVE_TABLE, TablesActionTypes, UPDATE_TABLES } from '../actions/tablesActions';

// Define the shape of the state
interface AppState {
  tables: Table[];
}

// Selectors
export const getTableByTableNumber = (state: AppState, tableNumber: number): Table | undefined =>
  state.tables.find(table => table.tableNumber === tableNumber);

export const getAllTables = (state: AppState): Table[] =>
  state.tables;

// Reducer
const tablesReducer = (state: Table[] = [], action: TablesActionTypes): Table[] => {
  switch (action.type) {
    case UPDATE_TABLES:
      return [...action.payload as Table[]];
    case CHANGE_TABLE_DETAILS:
      return state.map(table => {
        if (table.tableNumber === (action.payload as { tableNumber: number }).tableNumber) {
          return {
            ...table,
            ...action.payload,
          };
        }
        return table;
      });
    case REMOVE_TABLE:
      return state.filter(table => table.tableNumber !== (action.payload as { tableNumber: number }).tableNumber );
    case ADD_TABLE:
      return [...state, action.payload as Table];
    default:
      return state;
  }
};

export default tablesReducer;

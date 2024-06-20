import { SET_TABLES, TablesActionTypes } from '../actions/tablesActions';
import { Table } from '../../types/tableTypes';

const initialState: Table[] = [];

const tablesReducer = (
  state = initialState,
  action: TablesActionTypes
): Table[] => {
  switch (action.type) {
    case SET_TABLES:
      return action.payload;
    default:
      return state;
  }
};

export const getAllTables = (state: any) => state.tables;

export default tablesReducer;

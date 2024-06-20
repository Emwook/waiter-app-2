
import { Table } from '../../types/tableTypes';

export const SET_TABLES = 'SET_TABLES';

export interface SetTablesAction {
  type: typeof SET_TABLES;
  payload: Table[]; // Ensure payload matches the expected type
}

export type TablesActionTypes = SetTablesAction;

export const setTables = (tables: Table[]): SetTablesAction => ({
  type: SET_TABLES,
  payload: tables,
});

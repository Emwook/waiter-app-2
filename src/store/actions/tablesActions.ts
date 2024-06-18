import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { Table } from "../../types/tableTypes"; // Assuming TablesActionTypes and Table are defined in your types
import { getFirestore } from "redux-firestore";

// Action creators types
interface AppState {
    tables: Table[]
}
interface UpdateTablesAction {
  type: typeof UPDATE_TABLES;
  payload: Table[];
}
interface ChangeTableDetailsAction {
  type: typeof CHANGE_TABLE_DETAILS;
  payload: Partial<Table> & { tableNumber: number };
}
interface RemoveTableAction {
  type: typeof REMOVE_TABLE;
  payload: { tableNumber: number };
}
interface AddTableAction {
  type: typeof ADD_TABLE;
  payload: Table;
}
export type TablesActionTypes = UpdateTablesAction | ChangeTableDetailsAction | RemoveTableAction | AddTableAction;

// Action creators
export const createActionName = (actionName: string) => `app/tables/${actionName}`;
export const UPDATE_TABLES = createActionName('UPDATE_TABLES');
export const CHANGE_TABLE_DETAILS = createActionName('CHANGE_TABLE_DETAILS');
export const REMOVE_TABLE = createActionName('REMOVE_TABLE');
export const ADD_TABLE = createActionName('ADD_TABLE');

export const updateTables = (payload: Table[]): UpdateTablesAction => ({ type: UPDATE_TABLES, payload });
export const changeDetails = (payload: Partial<Table> & { tableNumber: number }): ChangeTableDetailsAction => ({ type: CHANGE_TABLE_DETAILS, payload });
export const removeTable = (payload: { tableNumber: number }): RemoveTableAction => ({ type: REMOVE_TABLE, payload });
export const addTable = (payload: Table): AddTableAction => ({ type: ADD_TABLE, payload });

// Thunk actions
export const fetchAllTableData = (): ThunkAction<void, AppState, unknown, TablesActionTypes> => {
  return async (dispatch: Dispatch<TablesActionTypes>) => {
    try {
        // Perform API delete or other actions here
      }  catch (error) {
      console.error("Error fetching tables:", error);
    }
  };
};

export const requestUpdateDetails = (data: Partial<Table> & { tableNumber: number }): ThunkAction<void, AppState, unknown, TablesActionTypes> => {
  return async (dispatch: Dispatch<TablesActionTypes>) => {
    try {
      // Perform API update or other actions here
      dispatch(changeDetails(data));
    } catch (error) {
      console.error("Error updating table details:", error);
    }
  };
};

export const requestTableRemove = (data: { tableNumber: number }): ThunkAction<void, AppState, unknown, TablesActionTypes> => {
  return async (dispatch: Dispatch<TablesActionTypes>) => {
    try {
      // Perform API delete or other actions here
      dispatch(removeTable(data));
    } catch (error) {
      console.error("Error removing table:", error);
    }
  };
};

export const requestTableAdd = (data: Table): ThunkAction<void, AppState, unknown, TablesActionTypes> => {
  return async (dispatch: Dispatch<TablesActionTypes>, getState, { getFirebase, getFirestore }) => {
    try {
      const firestore = getFirestore();
      await firestore.collection('tables').add(data);
      dispatch(addTable(data));
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };
};

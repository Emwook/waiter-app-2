import { Table } from '../../types/tableTypes';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../store';
import { Dispatch } from 'redux';
import { addDoc, collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

type TablesState = Table[];

const initialState: TablesState = [];

interface SetTablesAction {
  type: typeof SET_TABLES;
  payload: TablesState;
}
interface AddTableAction {
  type: typeof ADD_TABLE;
  payload: Table;
}
interface RemoveTableAction {
  type: typeof REMOVE_TABLE;
  payload: { tableNumber: number };
}

interface UpdateTablesAction {
  type: typeof UPDATE_TABLES;
  payload: TablesState;
}
interface ChangeTableDetailsAction {
  type: typeof CHANGE_TABLE_DETAILS;
  payload: Partial<Table> & { tableNumber: number };
}

export type TablesActionTypes = UpdateTablesAction | ChangeTableDetailsAction 
                               | RemoveTableAction | AddTableAction | SetTablesAction;

const createActionName = (actionName: string) => `app/tables/${actionName}`;
export const SET_TABLES = createActionName('SET_TABLES');
export const ADD_TABLE = createActionName('ADD_TABLE');
export const REMOVE_TABLE = createActionName('REMOVE_TABLE');

export const UPDATE_TABLES = createActionName('UPDATE_TABLES');
export const CHANGE_TABLE_DETAILS = createActionName('CHANGE_TABLE_DETAILS');

export const setTables = (payload: TablesState): SetTablesAction => ({ type: SET_TABLES, payload });
export const addTable = (payload: Table): AddTableAction => ({ type: ADD_TABLE, payload });
export const removeTable = (payload: { tableNumber: number }): RemoveTableAction => ({ type: REMOVE_TABLE, payload });

export const updateTables = (payload: TablesState): UpdateTablesAction => ({ type: UPDATE_TABLES, payload });


export const fetchAllTableData = (): ThunkAction<void, AppState, unknown, TablesActionTypes> => {
  return async (dispatch: Dispatch<TablesActionTypes>) => {
    try {
        const tablesCollectionRef = collection(db, "tables");
        const data = await getDocs(tablesCollectionRef);
        const filteredData: Table[] = data.docs.map((doc) => ({
            ...doc.data(), 
        } as Table));
        dispatch(setTables(filteredData));
        console.log(filteredData);
      }  catch (error) {
      console.error("Error fetching tables:", error);
    }
  };
};

export const requestTableAdd = (data: Table): ThunkAction<void, AppState, unknown, TablesActionTypes> => {
  return async (dispatch: Dispatch<TablesActionTypes>) => {
    const tablesCollection = collection(db, 'tables');
    try {
      await addDoc(tablesCollection, data);
      dispatch(addTable(data));
    } catch (error) {
      console.error("Error adding table:", error);
    }
  };
};

export const requestTableRemove = (table: Table ): ThunkAction<void, TablesState, unknown, TablesActionTypes> => {
  return async (dispatch: Dispatch<TablesActionTypes>) => {
    const tablesCollectionRef = collection(db, 'tables');
    const q = query(tablesCollectionRef, where('tableNumber', '==', table.tableNumber));
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            try {
                await deleteDoc(doc.ref);
                dispatch(removeTable(table));
                console.log('Document removed successfully');
            } catch (error) {
                console.error('Error removing document:', error);
            }
        });
    } catch (error) {
        console.error('Error querying documents:', error);
    }
  };
};

const tablesReducer = (
  state = initialState,
  action: TablesActionTypes
): TablesState => {
  switch (action.type) {
    case SET_TABLES:
      return [...action.payload as TablesState];
    case ADD_TABLE:
      return [...state, action.payload as Table];
      case REMOVE_TABLE:
      return state.filter(table => table.tableNumber !== (action.payload as Table).tableNumber );
    default:
      return state;
  }
};

export const getAllTables = (state: any) => state.tables;

export default tablesReducer;
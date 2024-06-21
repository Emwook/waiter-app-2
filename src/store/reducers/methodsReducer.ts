import { GroupingMethod, Table } from '../../types/tableTypes';
import { ThunkAction } from 'redux-thunk';
import { Dispatch } from 'redux';
import { addDoc, collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { defaultGroupingMethod, defaultSortingMethod } from '../../config/settings';
import { SortingMethodEvent } from '../../types/customEventTypes';

interface MethodsState {
    groupingMethod: GroupingMethod;
    sortingMethod: keyof Table;
}

const initialState: MethodsState = {
    groupingMethod: defaultGroupingMethod,
    sortingMethod: defaultSortingMethod,
}

interface SetGroupingAction {
    type: typeof SET_GROUPING;
    payload: GroupingMethod;
}
interface SetSortingAction {
    type: typeof SET_SORTING;
    payload: keyof Table;
}


export type MethodsActionTypes = SetGroupingAction | SetSortingAction; 

const createActionName = (actionName: string) => `app/methods/${actionName}`;
export const SET_SORTING = createActionName('SET_SORTING');
export const SET_GROUPING = createActionName('SET_SORTING');

export const setGrouping = (payload: GroupingMethod): SetGroupingAction => ({ type: SET_GROUPING, payload });
export const setSorting = (payload: keyof Table): SetSortingAction => ({ type: SET_SORTING, payload });

export const fetchMethods = (): ThunkAction<void, MethodsState, unknown, MethodsActionTypes> => {
  return async (dispatch: Dispatch<MethodsActionTypes>) => {
    try {
        const methodsCollectionRef = collection(db,'methods');
        const q = query(methodsCollectionRef, where('id','==', 'methods'))
        const data = await getDocs(q);
        const filteredData: { groupingMethod, sortingMethod} = data.docs.map((doc) => ({
            ...doc.data(), 
        })); // here you havent finished yet ma'am /\ :P
        dispatch(setSorting(filteredData.sortingMethod))
        dispatch(setGrouping(filteredData.groupingMethod))
      }  catch (error) {
      console.error("Error fetching methods:", error);
    }
  };
};

const methodsReducer = (
  state = initialState,
  action: MethodsActionTypes
): MethodsState => {
  switch (action.type) {
    case SET_GROUPING:
      return {...state, groupingMethod: action.payload as GroupingMethod};
    case SET_SORTING:
        return {...state, sortingMethod: action.payload as keyof Table};
        default:
      return state;
  }
};

export const getGroupingMethod = (state: any) => state.groupingMethod;
export const getSortingMethid = (state: any) => state.sortingMethod;

export default methodsReducer;
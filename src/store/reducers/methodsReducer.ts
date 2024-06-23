import { GroupingMethod, Table } from '../../types/tableTypes';
import { defaultGroupingMethod, defaultSortingMethod } from '../../config/settings';

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
export const SET_GROUPING = createActionName('SET_GROUPING');
export const SET_SORTING = createActionName('SET_SORTING');

export const setGrouping = (payload: GroupingMethod): SetGroupingAction => ({ type: SET_GROUPING, payload });
export const setSorting = (payload: keyof Table): SetSortingAction => ({ type: SET_SORTING, payload });

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

export const getGroupingMethod = (state: any) => state.methods.groupingMethod;
export const getSortingMethod = (state: any) => state.methods.sortingMethod;

export default methodsReducer;
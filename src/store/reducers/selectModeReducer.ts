
import { Table } from "../../types/tableTypes";


interface SelectModeState {
    selectMode: boolean;
    selected: Table[];
}

const initialState: SelectModeState = {
    selectMode: false,
    selected: [],
};

interface EnterSelectMode {
    type: typeof ENTER_SELECT;
}

interface ToggleSelectedTable {
    type: typeof TOGGLE_SELECTED;
    payload: Table;
}

export type SelectModeActionTypes = EnterSelectMode | ToggleSelectedTable;

const createActionName = (actionName: string) => `app/select/${actionName}`;
export const ENTER_SELECT = createActionName('ENTER_SELECT');
export const TOGGLE_SELECTED = createActionName('TOGGLE_SELECTED');

export const enterSelect = (): EnterSelectMode => ({ type: ENTER_SELECT });
export const toggleSelected = (payload: Table): ToggleSelectedTable => ({ type: TOGGLE_SELECTED, payload });

const selectModeReducer = (
  state = initialState,
  action: SelectModeActionTypes
): SelectModeState => {
  switch (action.type) {
    case ENTER_SELECT:
      return {
        ...state, 
        selectMode: !state.selectMode, 
        selected: !state.selectMode ? state.selected : []
      };
    case TOGGLE_SELECTED:
      if ('payload' in action) {
        const isSelected = state.selected.includes(action.payload);
        const updatedSelected = isSelected 
          ? state.selected.filter(table => table.tableNumber !== action.payload.tableNumber)
          : [...state.selected, action.payload];
        return {
          ...state,
          selected: updatedSelected
        };
      }
      return state;
    default:
      return state;
  }
};

export const checkSelectMode = (state: any) => state.select.selectMode;
export const getSelected = (state: any) => state.select.selected;

export default selectModeReducer;

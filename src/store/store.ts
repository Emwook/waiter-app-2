
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import tablesReducer from './reducers/tablesReducer';
import { GroupingMethod, Table } from '../types/tableTypes';
import methodsReducer from './reducers/methodsReducer';
import { defaultGroupingMethod, defaultSortingMethod } from '../config/settings';


export interface AppState {
  tables: Table [],
  methods: {
    groupingMethod: GroupingMethod;
    sortingMethod: keyof Table;
  }
}
const subreducers = {
    tables: tablesReducer,
    methods: methodsReducer,
}

const reducer = combineReducers(subreducers);

const initialState: AppState = {
  tables: [],
  methods: {
    groupingMethod: defaultGroupingMethod,
    sortingMethod: defaultSortingMethod,
}
}
const store = createStore(
  reducer,
  initialState as any,
  compose(
    applyMiddleware(thunk)
  )
);

export default store;
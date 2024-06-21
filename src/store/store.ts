
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import tablesReducer from './reducers/tablesReducer';
import { Table } from '../types/tableTypes';


export interface AppState {
  tables: Table [],
}
const subreducers = {
    tables: tablesReducer,
}

const reducer = combineReducers(subreducers);

const initialState: AppState = {
  tables: []
}
const store = createStore(
  reducer,
  initialState as any,
  compose(
    applyMiddleware(thunk)
  )
);

export default store;
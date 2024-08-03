import { createStore, combineReducers, applyMiddleware,  } from 'redux';
import { thunk } from 'redux-thunk';
import tablesReducer from './reducers/tablesReducer';
import { GroupingMethod, Table } from '../types/tableTypes';
import methodsReducer from './reducers/methodsReducer';
import { defaultGroupingMethod, defaultSortingMethod } from '../config/settings';
import selectModeReducer from './reducers/selectModeReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Reservation } from '../types/reservationTypes';
import reservationsReducer from './reducers/reservationsReducer';
import messageReducer from './reducers/messageReducer';
import { Product } from '../types/productTypes';
import productReducer from './reducers/productReducer';

export interface AppState {
  //firestore connected
  tables: Table[],
  reservations: Reservation[],
  products: Product[],
  //local
  methods: {
    groupingMethod: GroupingMethod;
    sortingMethod: keyof Table;
  },
  select: {
    selectMode: boolean;
    selected: Table[];
  }
  message: {
    messageNumber: number;
  }
}

const subreducers = {
    tables: tablesReducer,
    methods: methodsReducer,
    select: selectModeReducer,
    reservations: reservationsReducer,
    message: messageReducer,
    products: productReducer,
}

const reducer = combineReducers(subreducers);

const initialState: AppState = {
  tables: [],
  reservations: [],
  methods: {
    groupingMethod: defaultGroupingMethod,
    sortingMethod: defaultSortingMethod,
  },
  select: {
    selectMode: false,
    selected: [],
  },
  message: {
    messageNumber: 0,
  },
  products: [],
}
const store = createStore(
  reducer,
  initialState as any,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);

export default store;
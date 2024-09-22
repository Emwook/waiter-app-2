import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk';  // Simple correct import for redux-thunk
import tablesReducer from './reducers/tablesReducer';
import methodsReducer from './reducers/methodsReducer';
import selectModeReducer from './reducers/selectModeReducer';
import reservationsReducer from './reducers/reservationsReducer';
import messageReducer from './reducers/messageReducer';
import productReducer from './reducers/productReducer';
import orderReducer from './reducers/orderReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { GroupingMethod, Table } from '../types/tableTypes';
import { Reservation } from '../types/reservationTypes';
import { Product } from '../types/productTypes';
import { Order } from '../types/orderItemTypes';
import { defaultGroupingMethod, defaultSortingMethod } from '../config/settings';

// Define the app state type
export interface AppState {
  tables: Table[],
  reservations: Reservation[],
  products: Product[],
  orders: Order[],
  methods: {
    groupingMethod: GroupingMethod;
    sortingMethod: keyof Table;
  },
  select: {
    selectMode: boolean;
    selected: Table[];
  },
  message: {
    messageNumber: number;
  }
}

// Combine reducers
const rootReducer = combineReducers({
  tables: tablesReducer,
  methods: methodsReducer,
  select: selectModeReducer,
  reservations: reservationsReducer,
  message: messageReducer,
  products: productReducer,
  orders: orderReducer
});

// Initial state
const initialState: AppState = {
  tables: [],
  reservations: [],
  products: [],
  orders: [],
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
  }
};

// Use the Redux DevTools only in development mode
const composeEnhancers = (process.env.NODE_ENV === 'development' ? composeWithDevTools : compose) || compose;

// Create store with middleware and initial state
const store = createStore(
  rootReducer,
  initialState as any,  // Minimal typing to bypass issues for now
  composeEnhancers(applyMiddleware(thunk) as any)  // Apply middleware directly
);

export default store;



import { firebaseConfig } from '../config/firebaseConfig'
import tablesReducer from './reducers/tablesReducer';
import { createStore, combineReducers, compose } from 'redux';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const rfConfig = {}; // optional redux-firestore Config Options

// Initialize firebase instance
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore through Firebase
export const firestore = getFirestore(app);

// Add reduxFirestore store enhancer to store creator
const createStoreWithFirebase = compose(
  reduxFirestore(app, rfConfig), // firebase instance as first argument, rfConfig as optional second
)(createStore);

// Add Firebase to reducers
const rootReducer = combineReducers({
  tablesReducer: tablesReducer,
  firestore: firestoreReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

// Create store with reducers and initial state
const initialState = {};
const store = createStoreWithFirebase(rootReducer, initialState);

export default store;
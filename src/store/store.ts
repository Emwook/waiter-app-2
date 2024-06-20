
//import { Provider } from 'react-redux'
//import { render } from 'react-dom'
import { createStore, combineReducers } from 'redux'
//import {ThunkMiddleware, withExtraArgument} from 'redux-thunk';
//import { configureStore } from '@reduxjs/toolkit'

//import { reduxFirestore, getFirestore } from "redux-firestore";
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore'
import {  firebaseReducer } from 'react-redux-firebase'

import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'

import tablesReducer from "./reducers/tablesReducer";
import { firebaseConfig } from "../config/firebaseConfig";

const rrfConfig = {
  userProfile: 'users'
}
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Define rootReducer combining firestoreReducer and custom reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  tables: tablesReducer,
});

// Define initial state and create Redux store
const initialState = {};
const store = createStore(rootReducer, initialState)

const rrfProps = {
  firebase: app,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance 
}

export { store, rrfProps };
export { db };
export default store;

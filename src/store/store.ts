import { createStore, applyMiddleware, compose } from "redux";
import {thunk} from "redux-thunk";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";
import { reduxFirestore, getFirestore } from "redux-firestore";
import firebase from 'firebase/app';
import 'firebase/firestore';
import tablesReducer from "./reducers/tablesReducer";
import { combineReducers } from "redux";
import { firebaseConfig } from "../config/firebase";

// Define rootReducer combining firestoreReducer and custom reducers
const rootReducer = combineReducers({
  firestore: firestoreReducer,
  tables: tablesReducer,
});

// Define initial state and create Redux store
const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirestore })),
    reduxFirestore(firebase, firebaseConfig as any)
  )
);

// Create instance for Firestore with Redux
const rrfProps = {
  firebase,
  config: firebaseConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

export { store, rrfProps };
export default store;

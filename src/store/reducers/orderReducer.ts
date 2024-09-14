import { ThunkAction } from 'redux-thunk';
import { AppState } from '../store';
import { Dispatch } from 'redux';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Order, OrderItem, Orders } from '../../types/orderItemTypes';

const initialState: Orders = [];

// Define the action types
const SET_ORDERS = 'SET_ORDERS';
const SET_SINGLE_ORDER = 'SET_SINGLE_ORDER';

interface SetOrdersAction {
  type: typeof SET_ORDERS;
  payload: Orders;
}

interface SetSingleOrderAction {
  type: typeof SET_SINGLE_ORDER;
  payload: Order;
}

type OrderActionTypes = SetOrdersAction | SetSingleOrderAction;

// Action creators
export const setOrders = (payload: Orders): SetOrdersAction => ({
  type: SET_ORDERS,
  payload,
});

export const setSingleOrder = (payload: Order): SetSingleOrderAction => ({
  type: SET_SINGLE_ORDER,
  payload,
});

// Thunks
export const requestFetchAllOrders = (): ThunkAction<void, AppState, unknown, OrderActionTypes> => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    const orderCollectionRef = collection(db, 'orders');

    try {
      const querySnapshot = await getDocs(orderCollectionRef);
      const orders: Orders = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Order;
        orders.push({
          tableNumber: data.tableNumber,
          items: data.items.map(item => ({
            ...item,
            chosenParams: item.chosenParams || [],  // Ensure chosenParams is always an array
          })),
        });
      });

      dispatch(setOrders(orders));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
};

export const requestFetchSingleOrder = (tableNumber: number): ThunkAction<void, AppState, unknown, OrderActionTypes> => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    const ordersCollectionRef = collection(db, 'orders');
    const q = query(ordersCollectionRef, where('tableNumber', '==', tableNumber));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data() as Order;

        const order: Order = {
          tableNumber: data.tableNumber,
          items: data.items.map(item => ({
            ...item,
            chosenParams: item.chosenParams || [],  // Ensure chosenParams is always an array
          })),
        };

        dispatch(setSingleOrder(order));
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };
};

export const requestChangeOrder = (
  order: Order
): ThunkAction<void, AppState, unknown, OrderActionTypes> => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    const ordersCollectionRef = collection(db, 'orders');
    const q = query(ordersCollectionRef, where('tableNumber', '==', order.tableNumber));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];

        // Completely override the existing items with the new ones
        await updateDoc(doc.ref, {
          tableNumber: order.tableNumber,
          items: order.items,  // Use the new items array as is
        });

        // Dispatch the updated order to Redux
        dispatch(setSingleOrder(order));
      } else {
        // If no document exists, add a new one
        await addDoc(ordersCollectionRef, order);
        dispatch(setSingleOrder(order));
      }
    } catch (error) {
      console.error('Error querying or updating orders:', error);
    }
  };
};


// Reducer
const orderReducer = (state = initialState, action: OrderActionTypes): Orders => {
  switch (action.type) {
    case SET_ORDERS:
      return action.payload;

    case SET_SINGLE_ORDER:
      // Line 69: Replace the order's items with the updated ones
      return state.map(order =>
        order.tableNumber === action.payload.tableNumber
          ? { ...order, items: action.payload.items }  // Replace the items array entirely
          : order
      );

    default:
      return state;
  }
};

// Selectors
export const getOrder = (state: AppState, tableNumber: number): Order | undefined =>
  state.orders.find(order => order.tableNumber === tableNumber);

export const getOrders = (state: any) => state.orders;

export default orderReducer;

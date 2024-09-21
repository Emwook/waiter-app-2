import { ThunkAction } from 'redux-thunk';
import { AppState } from '../store';
import { Dispatch } from 'redux';
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Order, Orders } from '../../types/orderItemTypes';

const initialState: Orders = [];

// Define the action types
const createActionName = (actionName: string) => `app/orders/${actionName}`;
const SET_ORDERS = createActionName('SET_ORDERS');
const CHANGE_SINGLE_ORDER = createActionName('CHANGE_SINGLE_ORDER');
const REMOVE_SINGLE_ORDER = createActionName('REMOVE_SINGLE_ORDER');
const ADD_SINGLE_ORDER = createActionName('ADD_SINGLE_ORDER');



interface SetOrdersAction {
  type: typeof SET_ORDERS;
  payload: Orders;
}

interface ChangeSingleOrderAction {
  type: typeof CHANGE_SINGLE_ORDER;
  payload: Order;
}

interface RemoveSingleOrderAction {
  type: typeof REMOVE_SINGLE_ORDER;
  payload: Order;
}

interface AddSingleOrderAction {
  type: typeof ADD_SINGLE_ORDER;
  payload: Order;
}

type OrderActionTypes = SetOrdersAction | ChangeSingleOrderAction | RemoveSingleOrderAction | AddSingleOrderAction;

// Action creators
export const setOrders = (payload: Orders): SetOrdersAction => ({
  type: SET_ORDERS,
  payload,
});

export const changeSingleOrder = (payload: Order): ChangeSingleOrderAction => ({
  type: CHANGE_SINGLE_ORDER,
  payload,
});

export const addSingleOrder = (payload: Order): ChangeSingleOrderAction => ({
  type: ADD_SINGLE_ORDER,
  payload,
});


export const removeSingleOrder = (payload: Order): RemoveSingleOrderAction => ({
  type: REMOVE_SINGLE_ORDER,
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
        dispatch(changeSingleOrder(order));
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };
};


export const requestOrderAdd = (data: Order): ThunkAction<void, AppState, unknown, OrderActionTypes> => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    const ordersCollectionRef = collection(db, 'orders');
    try {
      await addDoc(ordersCollectionRef, data);
      dispatch(addSingleOrder(data));
    } catch (error) {
      console.error("Error adding order:", error);
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
        await updateDoc(doc.ref, {
          tableNumber: order.tableNumber,
          items: order.items, 
        });

        dispatch(changeSingleOrder(order));
      } else {
        dispatch(requestOrderAdd(order) as any);

      }
    } catch (error) {
      console.error('Error querying or updating orders:', error);
    }
  };
};


export const requestOrderRemove = (order: Order): ThunkAction<void, AppState, unknown, OrderActionTypes> => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    const ordersCollectionRef = collection(db, 'orders');
    const q = query(ordersCollectionRef, where('tableNumber', '==', order.tableNumber));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        await deleteDoc(doc.ref);
      dispatch(removeSingleOrder(order));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };
};

// Reducer
const orderReducer = (state = initialState, action: OrderActionTypes): Orders => {
  switch (action.type) {
    case SET_ORDERS:
      return action.payload as Orders;
    case REMOVE_SINGLE_ORDER:
      return state.filter(order => order.tableNumber !== (action.payload as Order).tableNumber);
    case CHANGE_SINGLE_ORDER:
        return state.map(order =>
          order.tableNumber === (action.payload as Order).tableNumber
            ? { ...order, items: (action.payload as Order).items } 
            : order
        );
  case ADD_SINGLE_ORDER:
    return [...state, action.payload as Order]
    default:
      return state;
  }
};

// Selectors
export const getOrder = (state: AppState, tableNumber: number): Order | undefined =>
  state.orders.find(order => order.tableNumber === tableNumber);

export const getOrders = (state: any) => state.orders;

export default orderReducer;

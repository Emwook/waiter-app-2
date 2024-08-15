import { ThunkAction } from 'redux-thunk';
import { AppState } from '../store';
import { Dispatch } from 'redux';
import { collection, getDocs, query, updateDoc, where} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Order, OrderItem } from '../../types/cartItemTypes';

type OrderState = Order;

const initialState: OrderState = {
  items: [],
  tableNumber: 0,
};

interface SetOrderAction {
  type: typeof SET_ORDER;
  payload: OrderState;
}


export type OrderActionTypes = SetOrderAction

const createActionName = (actionName: string) => `app/order/${actionName}`;
export const SET_ORDER = createActionName('SET_ORDER');

export const setOrder = (payload: OrderState): SetOrderAction => ({ type: SET_ORDER, payload });

export const fetchOrderData = (tableNumber:number): ThunkAction<void, AppState, unknown, OrderActionTypes> => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    const orderCollectionRef = collection(db, "orders");
    const q = query(orderCollectionRef, where('tableNumber', '==', tableNumber));
    try {
      const data = await getDocs(q);
      const filteredData: OrderItem[] = data.docs.map((doc) => ({
        ...doc.data(),
      } as OrderItem));
      dispatch(setOrder({items:filteredData, tableNumber:tableNumber}));
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
};

export const requestChangeOrderDetails = (order: Order): ThunkAction<void, OrderState, unknown, OrderActionTypes> => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    const ordersCollectionRef = collection(db, 'orders');
    const q = query(ordersCollectionRef, where('tableNumber', '==', order.tableNumber));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        try {
          updateDoc(doc.ref, { ...order });
          dispatch(setOrder(order));
        } catch (error) {
          console.error('Error changing order details:', error);
          console.log(order);
        }
      });
    } catch (error) {
      console.error('Error querying orders:', error);
    }
  };
};

const orderReducer = (
  state = initialState,
  action: OrderActionTypes
): OrderState => {
  switch (action.type) {
    case SET_ORDER:
      return {...action.payload as Order};
    default:
      return state;
  }
};

export const getOrder = (state: any) => state.order;

export default orderReducer;

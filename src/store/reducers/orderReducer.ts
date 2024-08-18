import { ThunkAction } from 'redux-thunk';
import { AppState } from '../store';
import { Dispatch } from 'redux';
import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where} from 'firebase/firestore';
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

export const requestFetchOrderData = (tableNumber:number): ThunkAction<void, AppState, unknown, OrderActionTypes> => {
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

export const requestChangeOrder = (
  order: Order
): ThunkAction<void, OrderState, unknown, OrderActionTypes> => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    const ordersCollectionRef = collection(db, 'orders');
    const q = query(ordersCollectionRef, where('tableNumber', '==', order.tableNumber));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log('Document found:', querySnapshot);

        querySnapshot.forEach(async (doc) => {
          try {
            const existingData = doc.data();
            const existingItems: OrderItem[] = existingData.items || [];
            const tableNumber: number = existingData.tableNumber;

            // Merge the new items with the existing items
            const updatedItems = [...existingItems, ...order.items];

            // Update the document with the merged items array
            await updateDoc(doc.ref, {
              tableNumber: tableNumber,
              items: updatedItems,
            });

            dispatch(setOrder({ tableNumber, items: updatedItems }));
          } catch (error) {
            console.error('Error updating order details:', error);
          }
        });
      } else {
        try {
          // If no document exists, add a new one
          await addDoc(ordersCollectionRef, order);
          dispatch(setOrder(order));
        } catch (error) {
          console.error("Error adding new order:", error);
        }
      }
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

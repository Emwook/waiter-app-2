import { ThunkAction } from 'redux-thunk';
import { AppState } from '../store';
import { Dispatch } from 'redux';
import { addDoc, collection, getDocs, query, updateDoc, where} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Order, OrderItem } from '../../types/orderItemTypes';

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

export const requestFetchOrderData = (tableNumber: number): ThunkAction<void, AppState, unknown, OrderActionTypes> => {
  return async (dispatch: Dispatch<OrderActionTypes>) => {
    const orderCollectionRef = collection(db, "orders");
    const q = query(orderCollectionRef, where('tableNumber', '==', tableNumber));

    try {
      const querySnapshot = await getDocs(q);
      const items: OrderItem[] = [];

      // Iterate over the documents and extract the items
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && Array.isArray(data.items)) {
          items.push(...data.items);
        }
      });

      // Dispatch the order with the correct items and tableNumber
      dispatch(setOrder({ items, tableNumber }));
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
        querySnapshot.forEach(async (doc) => {
          try {
            const existingData = doc.data();
            const existingItems: OrderItem[] = existingData.items || [];
            const tableNumber: number = existingData.tableNumber;

            // Check if the new order is smaller
            const newOrderSize = order.items.length;
            const existingOrderSize = existingItems.length;

            if (newOrderSize < existingOrderSize) {
              // If the new order has fewer items, replace the entire order
              await updateDoc(doc.ref, {
                tableNumber: tableNumber,
                items: order.items,
              });

              // Dispatch the new order directly
              dispatch(setOrder({ tableNumber, items: order.items }));
            } else {
              // Create a map of existing items by their code for easy lookup
              const itemMap = new Map<string, OrderItem>(
                existingItems.map(item => [item.code, item])
              );

              // Replace or add new items from the order argument
              order.items.forEach(newItem => {
                itemMap.set(newItem.code, newItem);
              });

              // Convert the map back to an array
              const updatedItems = Array.from(itemMap.values());

              // Update the document with the merged items array
              await updateDoc(doc.ref, {
                tableNumber: tableNumber,
                items: updatedItems,
              });

              // Update the passed order object with the merged items
              order.items = updatedItems;

              dispatch(setOrder({ tableNumber, items: updatedItems }));
            }
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

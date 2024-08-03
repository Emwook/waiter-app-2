import { ThunkAction } from 'redux-thunk';
import { AppState } from '../store';
import { Dispatch } from 'redux';
import { collection, getDocs} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Product } from '../../types/productTypes';

type ProductsState = Product[];

const initialState: ProductsState = [];

interface SetProductsAction {
  type: typeof SET_PRODUCTS;
  payload: ProductsState;
}


export type ProductsActionTypes = SetProductsAction;

const createActionName = (actionName: string) => `app/products/${actionName}`;
export const SET_PRODUCTS = createActionName('SET_PRODUCTS');

export const setProducts = (payload: ProductsState): SetProductsAction => ({ type: SET_PRODUCTS, payload });

export const fetchAllProductData = (): ThunkAction<void, AppState, unknown, ProductsActionTypes> => {
  return async (dispatch: Dispatch<ProductsActionTypes>) => {
    try {
      const productsCollectionRef = collection(db, "products");
      const data = await getDocs(productsCollectionRef);
      const filteredData: Product[] = data.docs.map((doc) => ({
        ...doc.data(),
      } as Product));
      dispatch(setProducts(filteredData));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
};

const productReducer = (
  state = initialState,
  action: ProductsActionTypes
): ProductsState => {
  switch (action.type) {
    case SET_PRODUCTS:
      return [...action.payload as ProductsState];
    default:
      return state;
  }
};

export const getAllProducts = (state: any) => state.products;

export default productReducer;

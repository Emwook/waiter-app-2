import { ThunkAction } from "redux-thunk";
import { AppState } from "../store";
import { Dispatch } from "redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export interface User {
  name: string;
  password: string;
}

interface UserState {
  users: User[],
  currentUser: User,
};

const initialState: UserState= {
  users: [],
  currentUser: {name: '', password: ''}
}

interface SignInAction {
    type: typeof SIGN_IN;
    payload: User;
}

interface SetUsersAction {
  type: typeof SET_USERS;
  payload: User[];
}


export type UserActionTypes = SignInAction | SetUsersAction;

const createActionName = (actionName: string) => `app/users/${actionName}`;
export const SIGN_IN = createActionName('SIGN_IN');
export const SET_USERS = createActionName('SET_USERS');


export const signIn = (payload: User): SignInAction => ({ type: SIGN_IN, payload });
const setUsers = (payload: User[]): SetUsersAction => ({ type: SET_USERS, payload });

export const fetchAllExistingUsers = (): ThunkAction<void, AppState, unknown, UserActionTypes> => {
  return async (dispatch: Dispatch<UserActionTypes>) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const data = await getDocs(usersCollectionRef);
      const filteredData: User[] = data.docs.map((doc) => ({
        ...doc.data(),
      } as User));
      dispatch(setUsers(filteredData));
    } catch (error) {
      console.error("Error fetching users list:", error);
    }
  };
};

const userReducer = (
  state = initialState,
  action: UserActionTypes,
): UserState => {
  switch (action.type) {
    case SET_USERS:
      return {...state, users: action.payload as User[] };
    case SIGN_IN:
      return {...state, currentUser: action.payload as User };
    default:
      return state;
  }
};

export const getCurrentUser = (state: any) => state.users.currentUser;
export const getAllUsers = (state: any) => state.users.users;

export default userReducer;
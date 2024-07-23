interface UserState {
    email: string;
    id: string;
}

const initialState: UserState = {
    email: '',
    id: '',
}

interface SignInAction {
    type: typeof SIGN_IN;
    payload: UserState;
}


export type UserActionTypes = SignInAction;

const createActionName = (actionName: string) => `app/user/${actionName}`;
export const SIGN_IN = createActionName('SIGN_IN');

export const signIn = (payload: UserState): SignInAction => ({ type: SIGN_IN, payload });

const userReducer = (
  state = initialState,
  action: UserActionTypes,
): UserState => {
  switch (action.type) {
    case SIGN_IN:
      return {...action.payload};
    default:
      return state;
  }
};

export const getUserEmail = (state: any) => state.user.email;

export default userReducer;
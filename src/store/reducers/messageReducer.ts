interface MessageState {
    messageNumber: number;
}

const initialState: MessageState = {
    messageNumber: 0,
}

interface ChangeMessageAction {
    type: typeof CHANGE_MESSAGE;
    payload: number;
}


export type MessageActionTypes = ChangeMessageAction;

const createActionName = (actionName: string) => `app/message/${actionName}`;
export const CHANGE_MESSAGE = createActionName('CHANGE_MESSAGE');

export const changeMessage = (payload: number): MessageActionTypes => ({ type: CHANGE_MESSAGE, payload });

const messageReducer = (
  state = initialState,
  action: MessageActionTypes
): MessageState => {
  switch (action.type) {
    case CHANGE_MESSAGE:
      return {messageNumber: action.payload};
    default:
      return state;
  }
};

export const getMessageNumber = (state: any) => state.message.messageNumber;

export default messageReducer;
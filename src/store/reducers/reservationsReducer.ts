import { Reservation } from '../../types/reservationTypes'; // Import Reservation type
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../store';
import { Dispatch } from 'redux';
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { createSelector } from 'reselect';


type ReservationsState = Reservation[];

const initialState: ReservationsState = [];

interface SetReservationsAction {
  type: typeof SET_RESERVATIONS;
  payload: ReservationsState;
}
interface AddReservationAction {
  type: typeof ADD_RESERVATION;
  payload: Reservation;
}
interface RemoveReservationAction {
  type: typeof REMOVE_RESERVATION;
  payload: { id: string };
}
interface ChangeReservationDetailsAction {
  type: typeof CHANGE_RESERVATION_DETAILS;
  payload: Reservation;
}

export type ReservationsActionTypes = 
  SetReservationsAction | 
  AddReservationAction | 
  RemoveReservationAction | 
  ChangeReservationDetailsAction;

const createActionName = (actionName: string) => `app/reservations/${actionName}`;
export const SET_RESERVATIONS = createActionName('SET_RESERVATIONS');
export const ADD_RESERVATION = createActionName('ADD_RESERVATION');
export const REMOVE_RESERVATION = createActionName('REMOVE_RESERVATION');
export const CHANGE_RESERVATION_DETAILS = createActionName('CHANGE_RESERVATION_DETAILS');

export const setReservations = (payload: ReservationsState): SetReservationsAction => ({ type: SET_RESERVATIONS, payload });
export const addReservation = (payload: Reservation): AddReservationAction => ({ type: ADD_RESERVATION, payload });
export const removeReservation = (payload: { id: string }): RemoveReservationAction => ({ type: REMOVE_RESERVATION, payload });
export const changeReservationDetails = (payload: Reservation): ChangeReservationDetailsAction => ({ type: CHANGE_RESERVATION_DETAILS, payload });

export const fetchAllReservationData = (): ThunkAction<void, AppState, unknown, ReservationsActionTypes> => {
  return async (dispatch: Dispatch<ReservationsActionTypes>) => {
    try {
      const reservationsCollectionRef = collection(db, "reservations");
      const data = await getDocs(reservationsCollectionRef);
      const filteredData: Reservation[] = data.docs.map((doc) => ({
        ...doc.data(),
        //dateStart: formatDate(doc.data().dateStart)
      } as Reservation));
      dispatch(setReservations(filteredData));
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };
};

export const requestReservationAdd = (data: Reservation): ThunkAction<void, AppState, unknown, ReservationsActionTypes> => {
  return async (dispatch: Dispatch<ReservationsActionTypes>) => {
    const reservationsCollection = collection(db, 'reservations');
    try {
      const docRef = await addDoc(reservationsCollection, data);
      const newReservation = { ...data, id: docRef.id }; //change to custom id generated manually
      dispatch(addReservation(newReservation));
    } catch (error) {
      console.error("Error adding reservation:", error);
    }
  };
};

export const requestReservationRemove = (reservation: Reservation): ThunkAction<void, ReservationsState, unknown, ReservationsActionTypes> => {
  return async (dispatch: Dispatch<ReservationsActionTypes>) => {
    const reservationsCollectionRef = collection(db, 'reservations');
    const q = query(reservationsCollectionRef, where('id', '==', reservation.id));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        try {
          await deleteDoc(doc.ref);
          dispatch(removeReservation({ id: reservation.id }));
          console.log('Reservation removed successfully');
        } catch (error) {
          console.error('Error removing reservation:', error);
        }
      });
    } catch (error) {
      console.error('Error querying reservations:', error);
    }
  };
};

export const requestChangeReservationDetails = (reservation: Reservation): ThunkAction<void, ReservationsState, unknown, ReservationsActionTypes> => {
  return async (dispatch: Dispatch<ReservationsActionTypes>) => {
    const reservationsCollectionRef = collection(db, 'reservations');
    const q = query(reservationsCollectionRef, where('id', '==', reservation.id));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        try {
          await updateDoc(doc.ref, { ...reservation });
          dispatch(changeReservationDetails(reservation));
          console.log('Reservation details changed successfully');
        } catch (error) {
          console.error('Error changing reservation details:', error);
        }
      });
    } catch (error) {
      console.error('Error querying reservations:', error);
    }
  };
};

const reservationsReducer = (
  state = initialState,
  action: ReservationsActionTypes
): ReservationsState => {
  switch (action.type) {
    case SET_RESERVATIONS:
      return [...action.payload as ReservationsState];
    case ADD_RESERVATION:
      return [...state, action.payload as Reservation];
    case REMOVE_RESERVATION:
      return state.filter(reservation => reservation.id !== (action.payload as Reservation).id);
    case CHANGE_RESERVATION_DETAILS:
        if ('id' in action.payload) {
      return state.map(reservation =>
        reservation.id === (action.payload as Reservation).id ? action.payload : reservation
      ) as ReservationsState;
    }
    return state;
    default:
      return state;
  }
};

export const getAllReservations = (state: any) => state.reservations;

export const getRepeatingReservations = createSelector(
    [getAllReservations],
    (reservations: Reservation[]) => reservations.filter(reservation => reservation.repeat !== 'false')
);

export const getReservationsByDate = (selectedDate: string) => createSelector(
  [getAllReservations],
  (reservations: Reservation[]) => reservations.filter(
    (reservation) => reservation.dateStart === selectedDate
  )
);

export default reservationsReducer;

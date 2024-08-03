import { maxBill, mostNumOfPeople } from "./settings";

export interface Message {
    messageNumber: number;
    messageDetails: string;
    messageColor: 'success' | 'primary' | 'info' | 'warning' | 'danger';

}

  export const messages: Message[] = [
    {
      messageNumber: 1,
      messageDetails: 'Tables added successfully!',
      messageColor: 'success', 
    },
    {
      messageNumber: 2,
      messageDetails: 'Tables removed successfully.',
      messageColor: 'success', 
    },
    {
      messageNumber: 3,
      messageDetails: 'Table is now available.',
      messageColor: 'info', 
    },
    {
      messageNumber: 4,
      messageDetails: 'Selected tables joined successfully.',
      messageColor: 'success',
    },
    {
      messageNumber: 5,
      messageDetails: 'New reservation created.',
      messageColor: 'success',
    },
    {
      messageNumber: 6,
      messageDetails: 'Reservation not found.',
      messageColor: 'danger',
    },
    {
      messageNumber: 7,
      messageDetails: 'Reservation cancelled.',
      messageColor: 'warning', 
    },
    {
      messageNumber: 8,
      messageDetails: 'Reservation updated.',
      messageColor: 'success',
    },
    {
      messageNumber: 9,
      messageDetails: 'To combine or remove tables from the list, select them and confirm by pressing a corresponding button.',
      messageColor: 'primary',
    },
    {
        messageNumber: 10,
        messageDetails: 'number of people can be edited only when table is busy or currently reserved',
        messageColor: 'warning',
    },
    {
        messageNumber: 11,
        messageDetails: 'number of people can\'t exceed table capacity',
        messageColor: 'danger',
    },
    {
        messageNumber: 12,
        messageDetails: `table capacity can't be higher than ${mostNumOfPeople}`,
        messageColor: 'danger',
    },
    {
        messageNumber: 13,
        messageDetails: `please enter a number instead`,
        messageColor: 'warning',
    },
    {
        messageNumber: 14,
        messageDetails: `maximum bill per table is ${maxBill}$`,
        messageColor: 'danger',
    },
    {
        messageNumber: 15,
        messageDetails: `bill can be edited only when table is busy or currently reserved`,
        messageColor: 'warning',
    },
    {
      messageNumber: 16,
      messageDetails: `tables separated successfully`,
      messageColor: 'success',
  }

  ];
  
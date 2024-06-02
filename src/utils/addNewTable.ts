import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase'; 
import { Table } from '../types/tableType';

export const addNewTable = async (newTable:Table) => {
  const tablesCollection = collection(db, 'tables');
  try {
      await addDoc(tablesCollection, newTable);
      console.log('document added successfully');
    }
  catch (error) {
    console.error('Error adding document:', error);
  }
};

import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../store/store';  
import { Table } from '../../types/tableTypes';

export const addNewTable = async (newTable:Table) => {
  const tablesCollection = collection(firestore, 'tables');
  try {
      await addDoc(tablesCollection, newTable);
      console.log('document added successfully');
    }
  catch (error) {
    console.error('Error adding document:', error);
  }
};

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; 
import { Table } from '../types/tableType';

export const updateTable = async (id: string, newData: Partial<Table>) => {
  const tableRef = doc(db, 'tables', id);
  try {
    await updateDoc(tableRef, newData);
    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating document:', error);
  }
};
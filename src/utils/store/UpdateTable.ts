import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase'; 
import { Table } from '../../types/tableTypes';

export const updateTable = async (tableNumber: number, newData: Partial<Table>) => {
  const tablesCollection = collection(db, 'tables');
  const q = query(tablesCollection, where('tableNumber', '==', tableNumber));
  
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      const tableRef = doc(db, 'tables', docId);
      await updateDoc(tableRef, newData);
      console.log('Document updated successfully');
    } else {
      console.log('No document found with the specified tableNumber');
    }
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

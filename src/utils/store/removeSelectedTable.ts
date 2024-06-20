import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../store/store';
import { Table } from '../../types/tableTypes';

export const removeSelectedTable = async (table: Table) => {
    const tablesCollectionRef = collection(db, 'tables');
    const q = query(tablesCollectionRef, where('tableNumber', '==', table.tableNumber));

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            try {
                await deleteDoc(doc.ref);
                console.log('Document removed successfully');
            } catch (error) {
                console.error('Error removing document:', error);
            }
        });
    } catch (error) {
        console.error('Error querying documents:', error);
    }
};


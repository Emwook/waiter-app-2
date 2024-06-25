import { Table } from '../../types/tableTypes';

export const convertToSortingMethodName = <K extends keyof Table>(method: K) => {
    let methodName: string =''; 
    switch (method){
        case 'status':
            return methodName = 'table status';
        case 'tableNumber':
            return methodName = 'table number';
        case 'numOfPeople':
            return methodName = 'number of people';
        case 'maxNumOfPeople':
            return methodName = 'seating capacity';
        case 'bill':
            return methodName = 'bill';
      default:
        return methodName;
    }
};

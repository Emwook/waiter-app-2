import { Table } from '../types/tableType';

export const convertToMethodName = <K extends keyof Table>(method: K) => {
    const letterArray: string[] = method.split('');
    for (let i = 0; i < letterArray.length; i++) {
        if ( letterArray[i] === letterArray[i].toUpperCase()){
            letterArray[i].toLowerCase();
            letterArray.splice(i, 0, ' ')
        }
    }
    const methodName: string = letterArray.join('');
    return methodName;
};

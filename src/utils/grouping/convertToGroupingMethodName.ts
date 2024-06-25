import { GroupingMethod } from "../../types/tableTypes";

export const convertToGroupingMethodName = (method: GroupingMethod) => {
    let methodName: string =''; 
    switch (method){
        case 'none':
            return methodName = 'default';
        case 'combined':
            return methodName = 'combined tables';
        case 'status':
            return methodName = 'table status';
        default:
            return methodName;
    }
};
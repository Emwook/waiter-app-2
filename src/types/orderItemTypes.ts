export interface ChosenOption {
    label: string;
  }
  
  export interface ChosenParam {
    [section: string]: string[]; 
  }
  
  export type ChosenParams = ChosenParam[];
  
export interface OrderItem {
    id: string;
    code: string;
    name: string;
    priceSingle: number;
    amount: number;
    status: string;
    chosenParams?: ChosenParams;
}

export interface Order {
    items: OrderItem[];
    tableNumber: number;
}

export type Orders = Order[];


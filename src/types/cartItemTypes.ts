export interface ChosenOption {
    label: string;
    price: number;
}

export interface ChosenParams {
    [key: string]: {
        options: {
            [key: string]: ChosenOption;
        };
    };
}

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


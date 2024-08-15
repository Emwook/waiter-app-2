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
    name: string;
    priceSingle: number;
    amount: number;
    chosenParams?: ChosenParams;
}

export interface Order {
    items: OrderItem[];
    tableNumber: number;
}

export type Orders = Order[];


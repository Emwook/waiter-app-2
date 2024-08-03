export interface Option {
    label: string;
    price: number;
    default?: boolean;
}

export interface Params {
    [key: string]: {
        label: string;
        type: 'radios' | 'checkboxes' | 'select';
        options: {
            [key: string]: Option;
        };
    };
}

export interface Product {
    id: string;
    class?: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    params?: Params;
}

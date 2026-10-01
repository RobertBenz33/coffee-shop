export type Drink = {
    id: string;
    name: string;
    isActive: boolean;
    sizes: DrinkSizePrice[];
};

export type DrinkSizePrice = {
    id: string;
    price: number | string;
    drink: {
        id: string;
        name: string;
    };
    size: {
        id: string;
        name: string;
    };
};


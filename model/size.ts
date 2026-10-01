


export type Size = {
    id: string;
    name: string;
    isActive: boolean;
    drinks: {
        id: string;
        drink: {
            id: string;
            name: string;
        };
    }[];
};
export type IngredientType = "SYRUP" | "TOPPING";

export type Ingredient = {
    id: string;
    name: string;
    type: IngredientType;
    price: number | string;
    isActive?: boolean;
};


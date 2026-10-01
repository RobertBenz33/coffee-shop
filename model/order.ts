import type { IngredientType } from "./ingredient";

export type OrderStatus = "PENDING" | "PAID";

export type OrderIngredient = {
    id: string;
    ingredientName: string;
    ingredientType: IngredientType;
    quantity: number;
    unitPrice: number | string;
};

export type OrderItem = {
    id: string;
    drinkName: string;
    sizeName: string;
    unitPrice: number | string;
    ingredients: OrderIngredient[];
};

export type Order = {
    id: string;
    customerName: string;
    status: OrderStatus;
    totalPrice: number | string;
    createdAt: string;
    updatedAt: string;
    paidAt: string | null;
    items: OrderItem[];
};
"use client";

import { useEffect, useState } from "react";
import { DrinkManagement } from "./drink-management";
import { SizeManagement } from "./size-management";
import { IngredientManagement } from "./ingredient-management";
import { Ingredient } from "@/model/ingredient";
import { Drink } from "@/model/drink";
import { Size } from "@/model/size";







export function ManagementPage() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadData();
    }, []);
    async function loadData() {
        try {
            const [drinksResponse, sizesResponse, ingredientsResponse] =
                await Promise.all([
                    fetch("/api/drinks?includeInactive=true"),
                    fetch("/api/sizes?includeInactive=true"),
                    fetch("/api/ingredients?includeInactive=true"),
                ]);

            const [drinksData, sizesData, ingredientsData] =
                await Promise.all([
                    drinksResponse.json(),
                    sizesResponse.json(),
                    ingredientsResponse.json(),
                ]);

            setDrinks(drinksData.data ?? []);
            setSizes(sizesData.data ?? []);
            setIngredients(ingredientsData.data ?? []);
        } catch (error) {
            console.error("Failed to load management data", error);
        } finally {
            setLoading(false);
        }
    }



    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="space-y-8">
            <DrinkManagement
                drinks={drinks}
                onUpdated={loadData}
            />

            <SizeManagement
                sizes={sizes}
                onUpdated={loadData}
            />

            <IngredientManagement
                ingredients={ingredients}
                onUpdated={loadData}
            />
        </div>
    );
}
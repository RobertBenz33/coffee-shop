"use client";

import { useEffect, useState } from "react";
import { DrinkSizePricing } from "./drink-size-pricing";
import { IngredientPricing } from "./ingredient-pricing";
import { Ingredient } from "@/model/ingredient";
import { DrinkSizePrice } from "@/model/drink";
import { Size } from "@/model/size";


export function PricingPage() {
    const [drinkSizes, setDrinkSizes] = useState<DrinkSizePrice[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);
    const [sizes, setSizes] = useState<Size[]>([]);
    useEffect(() => {
        loadPricing();
    }, []);
    async function loadPricing() {
        try {
            const [drinkSizesResponse, ingredientsResponse, sizesResponse] =
                await Promise.all([
                    fetch("/api/pricing/drink-sizes"),
                    fetch("/api/ingredients?includeInactive=true"),
                    fetch("/api/sizes?includeInactive=true"),
                ]);

            const drinkSizesResult = await drinkSizesResponse.json();
            const ingredientsResult = await ingredientsResponse.json();
            const sizesResult = await sizesResponse.json();

            setDrinkSizes(drinkSizesResult.data);
            setIngredients(ingredientsResult.data);
            setSizes(sizesResult.data);
        } catch (error) {
            console.error("Failed to load pricing", error);
        } finally {
            setLoading(false);
        }
    }

    async function loadData() {
        const [
            drinkSizesResponse,
            ingredientsResponse,
            sizesResponse,
        ] = await Promise.all([
            fetch("/api/pricing/drink-sizes"),
            fetch("/api/ingredients?includeInactive=true"),
            fetch("/api/sizes?includeInactive=true"),
        ]);

        const drinkSizesResult =
            await drinkSizesResponse.json();

        const ingredientsResult =
            await ingredientsResponse.json();

        const sizesResult =
            await sizesResponse.json();

        setDrinkSizes(drinkSizesResult.data);
        setIngredients(ingredientsResult.data);
        setSizes(sizesResult.data);
    }

    if (loading) {
        return <p>Loading pricing...</p>;
    }

    return (
        <div className="space-y-8">
            <DrinkSizePricing
                items={drinkSizes}
                sizes={sizes}
                onUpdated={loadData}
            />

            <IngredientPricing
                ingredients={ingredients}
                onUpdated={loadPricing}
            />
        </div>
    );
}
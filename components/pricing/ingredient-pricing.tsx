"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ingredient } from "@/model/ingredient";



export function IngredientPricing({
    ingredients,
    onUpdated,
}: {
    ingredients: Ingredient[];
    onUpdated: () => void;
}) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [price, setPrice] = useState("");

    function startEdit(item: Ingredient) {
        setEditingId(item.id);
        setPrice(String(item.price));
    }

    async function save(item: Ingredient) {
        const response = await fetch(
            `/api/ingredients/${item.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    price: Number(price),
                }),
            },
        );

        if (!response.ok) {
            alert("ไม่สามารถแก้ราคาได้");
            return;
        }

        setEditingId(null);
        onUpdated();
    }

    const syrups = ingredients.filter(
        (item) => item.type === "SYRUP",
    );

    const toppings = ingredients.filter(
        (item) => item.type === "TOPPING",
    );

    function renderSection(
        title: string,
        items: Ingredient[],
    ) {
        return (
            <div className="space-y-3">
                <h3 className="font-semibold">{title}</h3>

                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-3"
                    >
                        <span>{item.name}</span>

                        {editingId === item.id ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    className="w-28"
                                    type="number"
                                    min="0"
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
                                />

                                <Button
                                    size="sm"
                                    onClick={() => save(item)}
                                >
                                    Save
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingId(null)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="font-semibold">
                                    ฿{Number(item.price).toFixed(2)}
                                </span>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEdit(item)}
                                >
                                    Edit
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ingredient Pricing</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
                {renderSection("Syrup", syrups)}
                {renderSection("Topping", toppings)}
            </CardContent>
        </Card>
    );
}
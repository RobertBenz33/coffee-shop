"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ingredient } from "@/model/ingredient";

export function IngredientManagement({
    ingredients,
    onUpdated,
}: {
    ingredients: Ingredient[];
    onUpdated: () => void;
}) {
    const [name, setName] = useState("");
    const [type, setType] = useState<"SYRUP" | "TOPPING">("SYRUP");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    async function createIngredient() {
        if (!name.trim()) return;

        const response = await fetch("/api/ingredients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name.trim(),
                type,
                price: 0,
            }),
        });

        if (!response.ok) {
            alert("ไม่สามารถเพิ่ม Ingredient ได้");
            return;
        }

        setName("");
        onUpdated();
    }

    function startEdit(ingredient: Ingredient) {
        setEditingId(ingredient.id);
        setEditingName(ingredient.name);
    }

    async function updateIngredient(
        ingredient: Ingredient,
    ) {
        const response = await fetch(
            `/api/ingredients/${ingredient.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: editingName.trim(),
                }),
            },
        );

        if (!response.ok) {
            alert("ไม่สามารถแก้ Ingredient ได้");
            return;
        }

        setEditingId(null);
        onUpdated();
    }

    async function toggleIngredient(
        ingredient: Ingredient,
    ) {
        const response = await fetch(
            `/api/ingredients/${ingredient.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    isActive: !ingredient.isActive,
                }),
            },
        );

        if (!response.ok) {
            alert("ไม่สามารถเปลี่ยนสถานะได้");
            return;
        }

        onUpdated();
    }
    const handleDelete = async (ingredient: Ingredient) => {
        const confirmed = window.confirm(
            `ต้องการลบ "${ingredient.name}" จริงหรือไม่?`,
        );

        if (!confirmed) {
            return;
        }

        const response = await fetch(
            `/api/ingredients/${ingredient.id}`,
            {
                method: "DELETE",
            },
        );

        const result = await response.json();

        if (!response.ok) {
            window.alert(
                result.message || "ไม่สามารถลบข้อมูลได้",
            );
            return;
        }

        await onUpdated();
    };
    const renderSection = (
        title: string,
        items: Ingredient[],
    ) => (
        <div className="space-y-3">
            <h3 className="font-semibold">{title}</h3>

            {items.map((ingredient) => (
                <div
                    key={ingredient.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                >
                    {editingId === ingredient.id ? (
                        <div className="flex flex-1 gap-2">
                            <Input
                                value={editingName}
                                onChange={(event) =>
                                    setEditingName(event.target.value)
                                }
                            />

                            <Button
                                size="sm"
                                onClick={() =>
                                    updateIngredient(ingredient)
                                }
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
                        <>
                            <div>
                                <p className="font-medium">
                                    {ingredient.name}
                                </p>

                                <p className="text-sm text-slate-500">
                                    ฿{Number(ingredient.price).toFixed(2)} ·{" "}
                                    {ingredient.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        startEdit(ingredient)
                                    }
                                >
                                    Edit
                                </Button>

                                <Button
                                    size="sm"
                                    variant={
                                        ingredient.isActive
                                            ? "destructive"
                                            : "default"
                                    }
                                    onClick={() =>
                                        toggleIngredient(ingredient)
                                    }
                                >
                                    {ingredient.isActive
                                        ? "Disable"
                                        : "Enable"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(ingredient)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ingredient</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
                {/* Add */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Ingredient name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />

                    <select
                        className="rounded-md border px-3"
                        value={type}
                        onChange={(event) =>
                            setType(
                                event.target.value as
                                | "SYRUP"
                                | "TOPPING",
                            )
                        }
                    >
                        <option value="SYRUP">Syrup</option>
                        <option value="TOPPING">Topping</option>
                    </select>

                    <Button onClick={createIngredient}>
                        Add
                    </Button>
                </div>

                {renderSection(
                    "Syrup",
                    ingredients.filter(
                        (item) => item.type === "SYRUP",
                    ),
                )}

                {renderSection(
                    "Topping",
                    ingredients.filter(
                        (item) => item.type === "TOPPING",
                    ),
                )}
            </CardContent>
        </Card>
    );
}
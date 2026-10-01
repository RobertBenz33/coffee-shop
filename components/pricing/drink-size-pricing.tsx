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
import { ChevronDown, ChevronRight } from "lucide-react";
import { DrinkSizePrice } from "@/model/drink";

type Size = {
    id: string;
    name: string;
    isActive: boolean;
};


export function DrinkSizePricing({
    items,
    sizes,
    onUpdated,
}: {
    items: DrinkSizePrice[];
    sizes: Size[];
    onUpdated: () => void;
}) {
    const [expandedDrinks, setExpandedDrinks] = useState<
        Record<string, boolean>
    >({});

    const [editingId, setEditingId] = useState<string | null>(null);
    const [price, setPrice] = useState("");

    function toggleDrink(drinkId: string) {
        setExpandedDrinks((prev) => ({
            ...prev,
            [drinkId]: !prev[drinkId],
        }));
    }

    function startEdit(item: DrinkSizePrice | null, drinkId: string, sizeId: string) {
        if (item) {
            setEditingId(item.id);
            setPrice(String(item.price));
            return;
        }

        // ยังไม่มี DrinkSize ใน DB
        // ใช้ temporary key เพื่อเปิด input
        setEditingId(`${drinkId}-${sizeId}`);
        setPrice("");
    }

    function cancelEdit() {
        setEditingId(null);
        setPrice("");
    }

    async function save(
        item: DrinkSizePrice | null,
        drinkId: string,
        sizeId: string,
    ) {
        const numericPrice = Number(price);

        if (!price.trim() || Number.isNaN(numericPrice) || numericPrice < 0) {
            alert("กรุณาระบุราคาที่ถูกต้อง");
            return;
        }

        let response: Response;

        if (item) {
            // มีราคาอยู่แล้ว → แก้ราคา
            response = await fetch(
                `/api/pricing/drink-sizes/${item.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        price: numericPrice,
                    }),
                },
            );
        } else {
            // ยังไม่มี DrinkSize → สร้างราคาใหม่
            response = await fetch("/api/pricing/drink-sizes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    drinkId,
                    sizeId,
                    price: numericPrice,
                }),
            });
        }

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            alert(
                result?.message ||
                "ไม่สามารถบันทึกราคาได้",
            );
            return;
        }

        cancelEdit();
        onUpdated();
    }

    // เอา Drink ทั้งหมดจาก items
    // และเรียงตามลำดับที่เข้ามา
    const drinks = Array.from(
        new Map(
            items.map((item) => [
                item.drink.id,
                item.drink,
            ]),
        ).values(),
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Drink Pricing</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {drinks.map((drink) => {
                    const isExpanded =
                        expandedDrinks[drink.id] ?? false;

                    return (
                        <div
                            key={drink.id}
                            className="rounded-lg border"
                        >
                            {/* Drink */}
                            <button
                                type="button"
                                className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50"
                                onClick={() =>
                                    toggleDrink(drink.id)
                                }
                            >
                                <span className="font-semibold">
                                    {drink.name}
                                </span>

                                {isExpanded ? (
                                    <ChevronDown className="h-5 w-5" />
                                ) : (
                                    <ChevronRight className="h-5 w-5" />
                                )}
                            </button>

                            {/* Sizes */}
                            {isExpanded && (
                                <div className="border-t">
                                    {sizes.map((size) => {
                                        const item =
                                            items.find(
                                                (priceItem) =>
                                                    priceItem.drink.id ===
                                                    drink.id &&
                                                    priceItem.size.id ===
                                                    size.id,
                                            );

                                        const editKey =
                                            item?.id ||
                                            `${drink.id}-${size.id}`;

                                        const isEditing =
                                            editingId === editKey;

                                        return (
                                            <div
                                                key={size.id}
                                                className="flex items-center justify-between border-b p-4 last:border-b-0"
                                            >
                                                <p className="font-medium">
                                                    {size.name}
                                                </p>

                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            className="w-28"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="Price"
                                                            value={price}
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                setPrice(
                                                                    event
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                        />

                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                save(
                                                                    item ||
                                                                    null,
                                                                    drink.id,
                                                                    size.id,
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={
                                                                cancelEdit
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        {item && (
                                                            <span className="font-semibold">
                                                                ฿
                                                                {Number(
                                                                    item.price,
                                                                ).toFixed(
                                                                    2,
                                                                )}
                                                            </span>
                                                        )}

                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                startEdit(
                                                                    item ||
                                                                    null,
                                                                    drink.id,
                                                                    size.id,
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
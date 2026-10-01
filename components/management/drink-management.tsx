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
import { Drink } from "@/model/drink";


export function DrinkManagement({
    drinks,
    onUpdated,
}: {
    drinks: Drink[];
    onUpdated: () => void;
}) {
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    async function createDrink() {
        if (!name.trim()) return;

        const response = await fetch("/api/drinks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name.trim(),
            }),
        });

        if (!response.ok) {
            const result = await response.json().catch(() => null);

            alert(
                result?.message || "ไม่สามารถเพิ่ม Drink ได้",
            );
            return;
        }

        setName("");
        onUpdated();
    }

    function startEdit(drink: Drink) {
        setEditingId(drink.id);
        setEditingName(drink.name);
    }

    async function updateDrink(drink: Drink) {
        if (!editingName.trim()) {
            alert("กรุณาระบุชื่อ Drink");
            return;
        }

        const response = await fetch(
            `/api/drinks/${drink.id}`,
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
            const result = await response.json().catch(() => null);

            alert(
                result?.message || "ไม่สามารถแก้ Drink ได้",
            );
            return;
        }

        setEditingId(null);
        setEditingName("");
        onUpdated();
    }

    async function toggleDrink(drink: Drink) {
        const response = await fetch(
            `/api/drinks/${drink.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    isActive: !drink.isActive,
                }),
            },
        );

        if (!response.ok) {
            const result = await response.json().catch(() => null);

            alert(
                result?.message ||
                "ไม่สามารถเปลี่ยนสถานะได้",
            );
            return;
        }

        onUpdated();
    }

    async function handleDelete(drink: Drink) {
        if (drink.sizes.length > 0) {
            const confirmed = window.confirm(
                `"${drink.name}" มี Size ใช้งานอยู่\n\nต้องการลบต่อหรือไม่?`,
            );

            if (!confirmed) {
                return;
            }
        } else {
            const confirmed = window.confirm(
                `ต้องการลบ "${drink.name}" จริงหรือไม่?`,
            );

            if (!confirmed) {
                return;
            }
        }

        const response = await fetch(
            `/api/drinks/${drink.id}`,
            {
                method: "DELETE",
            },
        );

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            window.alert(
                result?.message ||
                "ไม่สามารถลบข้อมูลได้",
            );
            return;
        }

        onUpdated();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Drink</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Add */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Drink name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />

                    <Button onClick={createDrink}>
                        Add
                    </Button>
                </div>

                {/* List */}
                <div className="space-y-2">
                    {drinks.map((drink) => (
                        <div
                            key={drink.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                        >
                            {editingId === drink.id ? (
                                <div className="flex flex-1 gap-2">
                                    <Input
                                        value={editingName}
                                        onChange={(event) =>
                                            setEditingName(
                                                event.target.value,
                                            )
                                        }
                                    />

                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            updateDrink(drink)
                                        }
                                    >
                                        Save
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditingName("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <p className="font-medium">
                                            {drink.name}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {drink.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                startEdit(drink)
                                            }
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant={
                                                drink.isActive
                                                    ? "destructive"
                                                    : "default"
                                            }
                                            onClick={() =>
                                                toggleDrink(drink)
                                            }
                                        >
                                            {drink.isActive
                                                ? "Disable"
                                                : "Enable"}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(drink)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
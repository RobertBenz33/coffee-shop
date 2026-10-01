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
import { Size } from "@/model/size";



export function SizeManagement({
    sizes,
    onUpdated,
}: {
    sizes: Size[];
    onUpdated: () => void;
}) {
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    async function createSize() {
        if (!name.trim()) return;

        const response = await fetch("/api/sizes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name.trim(),
            }),
        });

        if (!response.ok) {
            alert("ไม่สามารถเพิ่ม Size ได้");
            return;
        }

        setName("");
        onUpdated();
    }

    function startEdit(size: Size) {
        setEditingId(size.id);
        setEditingName(size.name);
    }

    async function updateSize(size: Size) {
        if (!editingName.trim()) {
            alert("กรุณาระบุชื่อ Size");
            return;
        }

        const response = await fetch(`/api/sizes/${size.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: editingName.trim(),
            }),
        });

        if (!response.ok) {
            const result = await response.json().catch(() => null);

            alert(
                result?.message || "ไม่สามารถแก้ Size ได้",
            );
            return;
        }

        setEditingId(null);
        setEditingName("");
        onUpdated();
    }

    async function toggleSize(size: Size) {
        const response = await fetch(`/api/sizes/${size.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                isActive: !size.isActive,
            }),
        });

        if (!response.ok) {
            const result = await response.json().catch(() => null);

            alert(
                result?.message || "ไม่สามารถเปลี่ยนสถานะได้",
            );
            return;
        }

        onUpdated();
    }

    async function handleDelete(size: Size) {
        let confirmed = false;

        if (size.drinks.length > 0) {
            confirmed = window.confirm(
                `"${size.name}" มีเครื่องดื่มใช้งานอยู่\n\nต้องการลบต่อหรือไม่?`,
            );
        } else {
            confirmed = window.confirm(
                `ต้องการลบ "${size.name}" จริงหรือไม่?`,
            );
        }

        if (!confirmed) {
            return;
        }

        const response = await fetch(
            `/api/sizes/${size.id}`,
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
                <CardTitle>Size</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Size name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />

                    <Button onClick={createSize}>
                        Add
                    </Button>
                </div>

                <div className="space-y-2">
                    {sizes.map((size) => (
                        <div
                            key={size.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                        >
                            {editingId === size.id ? (
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
                                            updateSize(size)
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
                                            {size.name}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {size.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                startEdit(size)
                                            }
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant={
                                                size.isActive
                                                    ? "destructive"
                                                    : "default"
                                            }
                                            onClick={() =>
                                                toggleSize(size)
                                            }
                                        >
                                            {size.isActive
                                                ? "Disable"
                                                : "Enable"}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(size)
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
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type OrderIngredient = {
    id: string;
    ingredientName: string;
    ingredientType: "SYRUP" | "TOPPING";
    quantity: number;
    unitPrice: number | string;
};

type OrderItem = {
    id: string;
    drinkName: string;
    sizeName: string;
    unitPrice: number | string;
    ingredients: OrderIngredient[];
};

type Order = {
    id: string;
    customerName: string;
    status: "PENDING" | "PAID";
    totalPrice: number | string;
    createdAt: string;
    paidAt: string | null;
    items: OrderItem[];
};

export function PurchaseHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
        null,
    );

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            setLoading(true);

            const response = await fetch("/api/orders");

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const result = await response.json();

            const orders: Order[] = (result.data ?? []).map(
                (order: Order) => ({
                    ...order,
                    items: order.items ?? [],
                }),
            );

            setOrders(orders);
        } catch (error) {
            console.error(error);
            alert("ไม่สามารถโหลดประวัติการซื้อได้");
        } finally {
            setLoading(false);
        }
    }


    function toggleOrder(orderId: string) {
        setExpandedOrderId((current) =>
            current === orderId ? null : orderId,
        );
    }

    function formatDate(date: string) {
        return new Intl.DateTimeFormat("th-TH", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(date));
    }

    function formatPrice(price: number | string) {
        return `฿${Number(price).toFixed(2)}`;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>ประวัติการซื้อ</CardTitle>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={loadOrders}
                >
                    Refresh
                </Button>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="py-10 text-center text-slate-500">
                        กำลังโหลด...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-10 text-center text-slate-500">
                        ยังไม่มีประวัติการซื้อ
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => {
                            const isExpanded =
                                expandedOrderId === order.id;

                            return (
                                <div
                                    key={order.id}
                                    className="rounded-lg border"
                                >
                                    {/* Order Header */}
                                    <button
                                        type="button"
                                        className="w-full p-4 text-left hover:bg-slate-50"
                                        onClick={() =>
                                            toggleOrder(order.id)
                                        }
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">
                                                    {order.customerName}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {formatDate(
                                                        order.createdAt,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {formatPrice(
                                                        order.totalPrice,
                                                    )}
                                                </p>

                                                <p
                                                    className={
                                                        order.status ===
                                                            "PAID"
                                                            ? "text-sm text-green-600"
                                                            : "text-sm text-orange-500"
                                                    }
                                                >
                                                    {order.status ===
                                                        "PAID"
                                                        ? "ชำระเงินแล้ว"
                                                        : "รอชำระเงิน"}
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Order Detail */}
                                    {isExpanded && (
                                        <div className="border-t p-4">
                                            <div className="space-y-4">
                                                {(order.items ?? []).map(
                                                    (item, index) => (
                                                        <div
                                                            key={item.id}
                                                            className="rounded-lg bg-slate-50 p-4"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {index +
                                                                            1}
                                                                        .{" "}
                                                                        {
                                                                            item.drinkName
                                                                        }
                                                                    </p>

                                                                    <p className="text-sm text-slate-500">
                                                                        Size:{" "}
                                                                        {
                                                                            item.sizeName
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <span className="font-semibold">
                                                                    {formatPrice(
                                                                        item.unitPrice,
                                                                    )}
                                                                </span>
                                                            </div>

                                                            {item
                                                                .ingredients
                                                                .length >
                                                                0 && (
                                                                    <div className="mt-3 border-t pt-3">
                                                                        <p className="mb-2 text-sm font-medium">
                                                                            Ingredients
                                                                        </p>

                                                                        <div className="space-y-1">
                                                                            {item.ingredients.map(
                                                                                (
                                                                                    ingredient,
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            ingredient.id
                                                                                        }
                                                                                        className="flex justify-between text-sm text-slate-600"
                                                                                    >
                                                                                        <span>
                                                                                            {
                                                                                                ingredient.ingredientName
                                                                                            }{" "}
                                                                                            ×{" "}
                                                                                            {
                                                                                                ingredient.quantity
                                                                                            }
                                                                                        </span>

                                                                                        <span>
                                                                                            {formatPrice(
                                                                                                Number(
                                                                                                    ingredient.unitPrice,
                                                                                                ) *
                                                                                                ingredient.quantity,
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>

                                            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
                                                <span>Total</span>

                                                <span>
                                                    {formatPrice(
                                                        order.totalPrice,
                                                    )}
                                                </span>
                                            </div>

                                            {order.paidAt && (
                                                <p className="mt-2 text-right text-sm text-slate-500">
                                                    ชำระเงินเมื่อ{" "}
                                                    {formatDate(
                                                        order.paidAt,
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
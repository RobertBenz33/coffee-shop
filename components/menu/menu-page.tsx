"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Ingredient } from "@/model/ingredient";
import { Drink, DrinkSizePrice } from "@/model/drink";



type SelectedIngredient = {
    ingredientId: string;
    quantity: number;
};

type OrderItem = {
    drinkSizeId: string;
    ingredients: SelectedIngredient[];
};

export function MenuPage() {
    const [step, setStep] = useState(1);
    const [customerName, setCustomerName] = useState("");

    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    const [selectedDrinkId, setSelectedDrinkId] = useState("");
    const [selectedSizeId, setSelectedSizeId] = useState("");

    const [selectedIngredients, setSelectedIngredients] = useState<
        SelectedIngredient[]
    >([]);

    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [drinksResponse, ingredientsResponse] = await Promise.all([
                    fetch("/api/drinks"),
                    fetch("/api/ingredients"),
                ]);

                const drinksData = await drinksResponse.json();
                const ingredientsData = await ingredientsResponse.json();

                setDrinks(drinksData.data ?? []);
                setIngredients(ingredientsData.data ?? []);
            } catch (error) {
                console.error("Failed to load menu", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const selectedDrink = useMemo(
        () => drinks.find((drink) => drink.id === selectedDrinkId),
        [drinks, selectedDrinkId],
    );

    const selectedDrinkSize = useMemo(
        () =>
            selectedDrink?.sizes.find((drinkSize) => drinkSize.size.id === selectedSizeId),
        [selectedDrink, selectedSizeId],
    );

    const syrups = ingredients.filter(
        (ingredient) => ingredient.type === "SYRUP",
    );

    const toppings = ingredients.filter(
        (ingredient) => ingredient.type === "TOPPING",
    );

    const totalPrice = useMemo(() => {
        let total = Number(selectedDrinkSize?.price ?? 0);

        for (const selected of selectedIngredients) {
            const ingredient = ingredients.find(
                (item) => item.id === selected.ingredientId,
            );

            if (ingredient) {
                total += Number(ingredient.price) * selected.quantity;
            }
        }

        return total;
    }, [selectedDrinkSize, selectedIngredients, ingredients]);

    function selectDrink(drinkId: string) {
        setSelectedDrinkId(drinkId);
        setSelectedSizeId("");
    }

    function selectSize(sizeId: string) {
        setSelectedSizeId(sizeId);
    }

    function addIngredient(ingredientId: string) {
        setSelectedIngredients((current) => {
            const existing = current.find(
                (item) => item.ingredientId === ingredientId,
            );

            if (existing) {
                return current.map((item) =>
                    item.ingredientId === ingredientId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            return [...current, { ingredientId, quantity: 1 }];
        });
    }

    function removeIngredient(ingredientId: string) {
        setSelectedIngredients((current) =>
            current
                .map((item) =>
                    item.ingredientId === ingredientId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    }

    function getIngredientQuantity(ingredientId: string) {
        return (
            selectedIngredients.find(
                (item) => item.ingredientId === ingredientId,
            )?.quantity ?? 0
        );
    }

    function nextStep() {
        if (step === 1) {
            if (!customerName.trim()) {
                alert("กรุณากรอกชื่อลูกค้า");
                return;
            }

            if (!selectedDrinkId) {
                alert("กรุณาเลือกเครื่องดื่ม");
                return;
            }

            if (!selectedSizeId) {
                alert("กรุณาเลือกขนาด");
                return;
            }
        }

        setStep((current) => current + 1);
    }

    function previousStep() {
        setStep((current) => Math.max(1, current - 1));
    }

    async function submitOrder() {
        if (!selectedDrinkSize) return;

        setSubmitting(true);

        try {
            const payload: OrderItem = {
                drinkSizeId: selectedDrinkSize.id,
                ingredients: selectedIngredients,
            };

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName: customerName.trim(),
                    items: [payload],
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message ?? "Failed to create order");
            }

            setOrderId(result.data.id);
            setStep(3);
        } catch (error) {
            console.error(error);
            alert("ไม่สามารถสร้าง Order ได้");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Coffee Shop</h1>
                    <p className="mt-1 text-slate-500">
                        The Customizable Coffee Shop
                    </p>
                </div>

                {/* Step indicator */}
                <div className="mb-8 flex items-center justify-center gap-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold ${step >= item
                                    ? "bg-black text-white"
                                    : "bg-slate-200 text-slate-500"
                                    }`}
                            >
                                {item}
                            </div>

                            {item < 3 && (
                                <div className="h-px w-10 bg-slate-300" />
                            )}
                        </div>
                    ))}
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <Input
                                    placeholder="Customer name"
                                    value={customerName}
                                    onChange={(event) =>
                                        setCustomerName(event.target.value)
                                    }
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Choose your drink</CardTitle>
                            </CardHeader>

                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {drinks.map((drink) => (
                                    <Button
                                        key={drink.id}
                                        variant={
                                            selectedDrinkId === drink.id ? "default" : "outline"
                                        }
                                        className="h-24 text-lg"
                                        onClick={() => selectDrink(drink.id)}
                                    >
                                        {drink.name}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        {selectedDrink && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Choose size</CardTitle>
                                </CardHeader>

                                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {selectedDrink.sizes.map((drinkSize) => (
                                        <Button
                                            key={drinkSize.id}
                                            variant={
                                                selectedSizeId === drinkSize.size.id
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className="h-20 flex-col"
                                            onClick={() => selectSize(drinkSize.size.id)}
                                        >
                                            <span>{drinkSize.size.name}</span>
                                            <span>฿{Number(drinkSize.price).toFixed(2)}</span>
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {selectedDrinkSize && (
                            <>
                                <IngredientSelector
                                    title="Syrup"
                                    ingredients={syrups}
                                    getQuantity={getIngredientQuantity}
                                    onAdd={addIngredient}
                                    onRemove={removeIngredient}
                                />

                                <IngredientSelector
                                    title="Topping"
                                    ingredients={toppings}
                                    getQuantity={getIngredientQuantity}
                                    onAdd={addIngredient}
                                    onRemove={removeIngredient}
                                />
                            </>
                        )}

                        <div className="flex justify-end">
                            <Button onClick={nextStep}>Next</Button>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className="space-y-6">
                        <OrderSummary
                            customerName={customerName}
                            drink={selectedDrink}
                            drinkSize={selectedDrinkSize}
                            ingredients={ingredients}
                            selectedIngredients={selectedIngredients}
                            totalPrice={totalPrice}
                        />

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={previousStep}>
                                Back
                            </Button>

                            <Button onClick={submitOrder} disabled={submitting}>
                                {submitting ? "Processing..." : "Pay & Order"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <Card className="mx-auto max-w-lg text-center">
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                🎉 Order Successful
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p>
                                Thank you, <strong>{customerName}</strong>
                            </p>

                            <Badge>Order ID: {orderId}</Badge>

                            <p className="text-2xl font-bold">
                                ฿{totalPrice.toFixed(2)}
                            </p>

                            <Button
                                className="w-full"
                                onClick={() => window.location.reload()}
                            >
                                New Order
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}

type IngredientSelectorProps = {
    title: string;
    ingredients: Ingredient[];
    getQuantity: (ingredientId: string) => number;
    onAdd: (ingredientId: string) => void;
    onRemove: (ingredientId: string) => void;
};

function IngredientSelector({
    title,
    ingredients,
    getQuantity,
    onAdd,
    onRemove,
}: IngredientSelectorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {ingredients.map((ingredient) => {
                    const quantity = getQuantity(ingredient.id);

                    return (
                        <div
                            key={ingredient.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                        >
                            <div>
                                <p className="font-medium">{ingredient.name}</p>
                                <p className="text-sm text-slate-500">
                                    +฿{Number(ingredient.price).toFixed(2)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {quantity > 0 && (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onRemove(ingredient.id)}
                                        >
                                            -
                                        </Button>

                                        <span className="w-6 text-center">
                                            {quantity}
                                        </span>
                                    </>
                                )}

                                <Button
                                    size="sm"
                                    onClick={() => onAdd(ingredient.id)}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

type OrderSummaryProps = {
    customerName: string;
    drink?: Drink;
    drinkSize?: DrinkSizePrice;
    ingredients: Ingredient[];
    selectedIngredients: SelectedIngredient[];
    totalPrice: number;
};

function OrderSummary({
    customerName,
    drink,
    drinkSize,
    ingredients,
    selectedIngredients,
    totalPrice,
}: OrderSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
                <div>
                    <p className="text-sm text-slate-500">Customer</p>
                    <p className="font-semibold">{customerName}</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between">
                        <span>
                            {drink?.name} - {drinkSize?.size.name}
                        </span>

                        <span>
                            ฿{Number(drinkSize?.price ?? 0).toFixed(2)}
                        </span>
                    </div>
                </div>

                {selectedIngredients.length > 0 && (
                    <div className="space-y-2 border-t pt-4">
                        {selectedIngredients.map((selected) => {
                            const ingredient = ingredients.find(
                                (item) => item.id === selected.ingredientId,
                            );

                            if (!ingredient) return null;

                            const price =
                                Number(ingredient.price) * selected.quantity;

                            return (
                                <div
                                    key={selected.ingredientId}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        {ingredient.name} × {selected.quantity}
                                    </span>

                                    <span>฿{price.toFixed(2)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex justify-between border-t pt-4 text-xl font-bold">
                    <span>Total</span>
                    <span>฿{totalPrice.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
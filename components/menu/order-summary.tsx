import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrderSummary({
    customerName,
    drinkName,
    sizeName,
    basePrice,
    ingredients,
    totalPrice,
}: {
    customerName: string;
    drinkName: string;
    sizeName: string;
    basePrice: number;
    ingredients: {
        name: string;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-slate-500">Customer</p>
                    <p className="font-semibold">{customerName}</p>
                </div>

                <div className="flex justify-between border-t pt-4">
                    <span>
                        {drinkName} - {sizeName}
                    </span>
                    <span>฿{basePrice.toFixed(2)}</span>
                </div>

                {ingredients.map((ingredient) => (
                    <div
                        key={ingredient.name}
                        className="flex justify-between text-sm"
                    >
                        <span>
                            {ingredient.name} × {ingredient.quantity}
                        </span>

                        <span>
                            ฿{(ingredient.price * ingredient.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}

                <div className="flex justify-between border-t pt-4 text-xl font-bold">
                    <span>Total</span>
                    <span>฿{totalPrice.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
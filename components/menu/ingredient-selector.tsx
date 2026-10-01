import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ingredient } from "@/model/ingredient";



type IngredientSelectorProps = {
    title: string;
    ingredients: Ingredient[];
    getQuantity: (id: string) => number;
    onAdd: (id: string) => void;
    onRemove: (id: string) => void;
};

export function IngredientSelector({
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

            <CardContent className="grid gap-4 md:grid-cols-3">
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

                                        <span className="w-5 text-center">
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
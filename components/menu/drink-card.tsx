import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DrinkCardProps = {
    id: string;
    name: string;
    selected: boolean;
    onSelect: (id: string) => void;
};

export function DrinkCard({
    id,
    name,
    selected,
    onSelect,
}: DrinkCardProps) {
    return (
        <Card
            className={`cursor-pointer transition ${selected ? "ring-2 ring-black" : ""
                }`}
        >
            <CardContent className="p-4">
                <Button
                    variant={selected ? "default" : "outline"}
                    className="h-20 w-full text-lg"
                    onClick={() => onSelect(id)}
                >
                    {name}
                </Button>
            </CardContent>
        </Card>
    );
}
import { Button } from "@/components/ui/button";

type Size = {
    id: string;
    name: string;
};

type SizeSelectorProps = {
    sizes: {
        id: string;
        price: number | string;
        size: Size;
    }[];
    selectedSizeId: string;
    onSelect: (sizeId: string) => void;
};

export function SizeSelector({
    sizes,
    selectedSizeId,
    onSelect,
}: SizeSelectorProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {sizes.map((item) => (
                <Button
                    key={item.id}
                    variant={
                        selectedSizeId === item.size.id ? "default" : "outline"
                    }
                    className="h-20 flex-col"
                    onClick={() => onSelect(item.size.id)}
                >
                    <span>{item.size.name}</span>
                    <span>฿{Number(item.price).toFixed(2)}</span>
                </Button>
            ))}
        </div>
    );
}
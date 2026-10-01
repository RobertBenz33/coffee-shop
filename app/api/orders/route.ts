import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OrderIngredientInput = {
    ingredientId: string;
    quantity?: number;
};

type OrderItemInput = {
    drinkSizeId: string;
    ingredients?: OrderIngredientInput[];
};

type CreateOrderInput = {
    customerName: string;
    items: OrderItemInput[];
};

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as CreateOrderInput;

        const customerName = String(body.customerName ?? "").trim();
        const items = Array.isArray(body.items) ? body.items : [];

        if (!customerName) {
            return NextResponse.json(
                {
                    message: "Customer name is required",
                },
                { status: 400 },
            );
        }

        if (items.length === 0) {
            return NextResponse.json(
                {
                    message: "Order must contain at least one item",
                },
                { status: 400 },
            );
        }

        // ---------------------------------------------------------
        // Validate duplicate drinkSize items / ingredient input
        // ---------------------------------------------------------

        for (const item of items) {
            if (!item.drinkSizeId) {
                return NextResponse.json(
                    {
                        message: "drinkSizeId is required",
                    },
                    { status: 400 },
                );
            }

            if (item.ingredients && !Array.isArray(item.ingredients)) {
                return NextResponse.json(
                    {
                        message: "ingredients must be an array",
                    },
                    { status: 400 },
                );
            }

            for (const ingredient of item.ingredients ?? []) {
                if (!ingredient.ingredientId) {
                    return NextResponse.json(
                        {
                            message: "ingredientId is required",
                        },
                        { status: 400 },
                    );
                }

                const quantity = ingredient.quantity ?? 1;

                if (
                    !Number.isInteger(quantity) ||
                    quantity <= 0
                ) {
                    return NextResponse.json(
                        {
                            message:
                                "Ingredient quantity must be a positive integer",
                        },
                        { status: 400 },
                    );
                }
            }
        }

        // ---------------------------------------------------------
        // Load current Master Data
        // ---------------------------------------------------------

        const drinkSizeIds = [
            ...new Set(items.map((item) => item.drinkSizeId)),
        ];

        const ingredientIds = [
            ...new Set(
                items.flatMap((item) =>
                    (item.ingredients ?? []).map(
                        (ingredient) => ingredient.ingredientId,
                    ),
                ),
            ),
        ];

        const [drinkSizes, ingredients] = await Promise.all([
            prisma.drinkSize.findMany({
                where: {
                    id: {
                        in: drinkSizeIds,
                    },
                    drink: {
                        isActive: true,
                    },
                    size: {
                        isActive: true,
                    },
                },
                include: {
                    drink: true,
                    size: true,
                },
            }),

            ingredientIds.length > 0
                ? prisma.ingredient.findMany({
                    where: {
                        id: {
                            in: ingredientIds,
                        },
                        isActive: true,
                    },
                })
                : Promise.resolve([]),
        ]);

        const drinkSizeMap = new Map(
            drinkSizes.map((drinkSize) => [
                drinkSize.id,
                drinkSize,
            ]),
        );

        const ingredientMap = new Map(
            ingredients.map((ingredient) => [
                ingredient.id,
                ingredient,
            ]),
        );

        // ---------------------------------------------------------
        // Validate Product references
        // ---------------------------------------------------------

        for (const item of items) {
            const drinkSize = drinkSizeMap.get(item.drinkSizeId);

            if (!drinkSize) {
                return NextResponse.json(
                    {
                        message:
                            `Drink/Size configuration not found or inactive: ${item.drinkSizeId}`,
                    },
                    { status: 400 },
                );
            }

            for (const itemIngredient of item.ingredients ?? []) {
                const ingredient = ingredientMap.get(
                    itemIngredient.ingredientId,
                );

                if (!ingredient) {
                    return NextResponse.json(
                        {
                            message:
                                `Ingredient not found or inactive: ${itemIngredient.ingredientId}`,
                        },
                        { status: 400 },
                    );
                }
            }
        }

        // ---------------------------------------------------------
        // Create Order Snapshot
        // ---------------------------------------------------------

        const order = await prisma.$transaction(async (tx) => {
            let totalPrice = 0;

            const orderItemsData = items.map((item) => {
                const drinkSize = drinkSizeMap.get(
                    item.drinkSizeId,
                )!;

                const ingredientItems =
                    item.ingredients ?? [];

                const ingredientTotal = ingredientItems.reduce(
                    (sum, itemIngredient) => {
                        const ingredient = ingredientMap.get(
                            itemIngredient.ingredientId,
                        )!;

                        const quantity =
                            itemIngredient.quantity ?? 1;

                        return (
                            sum +
                            Number(ingredient.price) *
                            quantity
                        );
                    },
                    0,
                );

                const itemTotal =
                    Number(drinkSize.price) +
                    ingredientTotal;

                totalPrice += itemTotal;

                return {
                    drinkName: drinkSize.drink.name,
                    sizeName: drinkSize.size.name,
                    unitPrice: drinkSize.price,

                    ingredients: {
                        create: ingredientItems.map(
                            (itemIngredient) => {
                                const ingredient =
                                    ingredientMap.get(
                                        itemIngredient.ingredientId,
                                    )!;

                                return {
                                    ingredientName:
                                        ingredient.name,
                                    ingredientType:
                                        ingredient.type,
                                    quantity:
                                        itemIngredient.quantity ??
                                        1,
                                    unitPrice:
                                        ingredient.price,
                                };
                            },
                        ),
                    },
                };
            });

            return tx.order.create({
                data: {
                    customerName,
                    status: "PAID",
                    totalPrice,

                    items: {
                        create: orderItemsData,
                    },
                },

                include: {
                    items: {
                        include: {
                            ingredients: true,
                        },
                    },
                },
            });
        });

        return NextResponse.json(
            {
                data: order,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("[POST /api/orders]", error);

        return NextResponse.json(
            {
                message: "Failed to create order",
            },
            { status: 500 },
        );
    }
}

export async function GET() {
    try {
        console.log("[GET /api/orders] START");

        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                items: {
                    include: {
                        ingredients: true,
                    },
                },
            },
        });

        console.log(
            "[GET /api/orders] SUCCESS",
            orders.length,
        );

        return NextResponse.json({
            data: orders.map((order) => ({
                ...order,
                totalPrice: Number(order.totalPrice),
            })),
        });
    } catch (error) {
        console.error(
            "[GET /api/orders] ERROR",
            error,
        );

        return NextResponse.json(
            {
                message: "Failed to fetch orders",
                error:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 },
        );
    }
}
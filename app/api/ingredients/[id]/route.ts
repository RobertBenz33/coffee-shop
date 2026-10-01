import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IngredientType } from "@/src/generated/prisma/enums";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: NextRequest,
    context: RouteContext,
) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        const existingIngredient =
            await prisma.ingredient.findUnique({
                where: {
                    id,
                },
            });

        if (!existingIngredient) {
            return NextResponse.json(
                {
                    message: "Ingredient not found",
                },
                { status: 404 },
            );
        }

        const data: {
            name?: string;
            type?: IngredientType;
            price?: number;
            isActive?: boolean;
        } = {};

        if (body.name !== undefined) {
            const name = String(body.name).trim();

            if (!name) {
                return NextResponse.json(
                    {
                        message: "Ingredient name cannot be empty",
                    },
                    { status: 400 },
                );
            }

            data.name = name;
        }

        if (body.type !== undefined) {
            if (
                body.type !== IngredientType.SYRUP &&
                body.type !== IngredientType.TOPPING
            ) {
                return NextResponse.json(
                    {
                        message:
                            "Ingredient type must be SYRUP or TOPPING",
                    },
                    { status: 400 },
                );
            }

            data.type = body.type;
        }

        if (body.price !== undefined) {
            const price = Number(body.price);

            if (!Number.isFinite(price) || price < 0) {
                return NextResponse.json(
                    {
                        message:
                            "Price must be a valid non-negative number",
                    },
                    { status: 400 },
                );
            }

            data.price = price;
        }

        if (body.isActive !== undefined) {
            if (typeof body.isActive !== "boolean") {
                return NextResponse.json(
                    {
                        message: "isActive must be a boolean",
                    },
                    { status: 400 },
                );
            }

            data.isActive = body.isActive;
        }

        const finalName = data.name ?? existingIngredient.name;
        const finalType = data.type ?? existingIngredient.type;

        if (
            data.name !== undefined ||
            data.type !== undefined
        ) {
            const duplicate =
                await prisma.ingredient.findFirst({
                    where: {
                        id: {
                            not: id,
                        },
                        name: {
                            equals: finalName,
                            mode: "insensitive",
                        },
                        type: finalType,
                    },
                });

            if (duplicate) {
                return NextResponse.json(
                    {
                        message: "Ingredient already exists",
                    },
                    { status: 409 },
                );
            }
        }

        const ingredient =
            await prisma.ingredient.update({
                where: {
                    id,
                },
                data,
            });

        return NextResponse.json({
            data: ingredient,
        });
    } catch (error) {
        console.error(
            "[PATCH /api/ingredients/:id]",
            error,
        );

        return NextResponse.json(
            {
                message: "Failed to update ingredient",
            },
            { status: 500 },
        );
    }
}
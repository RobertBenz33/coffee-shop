import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

        const price = Number(body.price);

        if (!Number.isFinite(price) || price < 0) {
            return NextResponse.json(
                {
                    message: "Price must be a valid non-negative number",
                },
                {
                    status: 400,
                },
            );
        }

        const ingredient = await prisma.ingredient.findUnique({
            where: {
                id,
            },
        });

        if (!ingredient) {
            return NextResponse.json(
                {
                    message: "Ingredient not found",
                },
                {
                    status: 404,
                },
            );
        }

        const updatedIngredient = await prisma.ingredient.update({
            where: {
                id,
            },
            data: {
                price,
            },
        });

        return NextResponse.json({
            data: updatedIngredient,
        });
    } catch (error) {
        console.error(
            "[PATCH /api/pricing/ingredients/:id]",
            error,
        );

        return NextResponse.json(
            {
                message: "Failed to update ingredient price",
            },
            {
                status: 500,
            },
        );
    }
}
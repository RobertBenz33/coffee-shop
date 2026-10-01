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

        const drinkSize = await prisma.drinkSize.findUnique({
            where: {
                id,
            },
        });

        if (!drinkSize) {
            return NextResponse.json(
                {
                    message: "Drink size pricing not found",
                },
                {
                    status: 404,
                },
            );
        }

        const updatedDrinkSize = await prisma.drinkSize.update({
            where: {
                id,
            },
            data: {
                price,
            },
            include: {
                drink: true,
                size: true,
            },
        });

        return NextResponse.json({
            data: updatedDrinkSize,
        });
    } catch (error) {
        console.error(
            "[PATCH /api/pricing/drink-sizes/:id]",
            error,
        );

        return NextResponse.json(
            {
                message: "Failed to update drink size price",
            },
            {
                status: 500,
            },
        );
    }
}
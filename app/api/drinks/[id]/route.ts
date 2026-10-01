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

        const existingDrink = await prisma.drink.findUnique({
            where: {
                id,
            },
        });

        if (!existingDrink) {
            return NextResponse.json(
                {
                    message: "Drink not found",
                },
                { status: 404 },
            );
        }

        const data: {
            name?: string;
            isActive?: boolean;
        } = {};

        if (body.name !== undefined) {
            const name = String(body.name).trim();

            if (!name) {
                return NextResponse.json(
                    {
                        message: "Drink name cannot be empty",
                    },
                    { status: 400 },
                );
            }

            const duplicate = await prisma.drink.findFirst({
                where: {
                    id: {
                        not: id,
                    },
                    name: {
                        equals: name,
                        mode: "insensitive",
                    },
                },
            });

            if (duplicate) {
                return NextResponse.json(
                    {
                        message: "Drink already exists",
                    },
                    { status: 409 },
                );
            }

            data.name = name;
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

        const drink = await prisma.drink.update({
            where: {
                id,
            },
            data,
        });

        return NextResponse.json({
            data: drink,
        });
    } catch (error) {
        console.error("[PATCH /api/drinks/:id]", error);

        return NextResponse.json(
            {
                message: "Failed to update drink",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    context: RouteContext,
) {
    try {
        const { id } = await context.params;

        const drink = await prisma.drink.findUnique({
            where: {
                id,
            },
        });

        if (!drink) {
            return NextResponse.json(
                {
                    message: "Drink not found",
                },
                { status: 404 },
            );
        }

        await prisma.drink.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            message: "Drink deleted successfully",
        });
    } catch (error) {
        console.error("[DELETE /api/drinks/:id]", error);

        return NextResponse.json(
            {
                message: "Failed to delete drink",
            },
            { status: 500 },
        );
    }
}
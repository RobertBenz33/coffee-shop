import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const includeInactive =
            request.nextUrl.searchParams.get("includeInactive") === "true";

        const drinks = await prisma.drink.findMany({
            where: includeInactive
                ? undefined
                : { isActive: true },
            include: {
                sizes: {
                    where: includeInactive
                        ? undefined
                        : {
                            size: {
                                isActive: true,
                            },
                        },
                    include: {
                        size: true,
                    },
                    orderBy: {
                        price: "asc",
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({
            data: drinks,
        });
    } catch (error) {
        console.error("[GET /api/drinks]", error);

        return NextResponse.json(
            {
                message: "Failed to fetch drinks",
            },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const name = String(body.name ?? "").trim();

        if (!name) {
            return NextResponse.json(
                {
                    message: "Drink name is required",
                },
                { status: 400 },
            );
        }

        const existingDrink = await prisma.drink.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (existingDrink) {
            return NextResponse.json(
                {
                    message: "Drink already exists",
                },
                { status: 409 },
            );
        }

        const drink = await prisma.$transaction(async (tx) => {
            const createdDrink = await tx.drink.create({
                data: {
                    name,
                    isActive: true,
                },
            });

            const activeSizes = await tx.size.findMany({
                where: {
                    isActive: true,
                },
            });

            if (activeSizes.length > 0) {
                await tx.drinkSize.createMany({
                    data: activeSizes.map((size) => ({
                        drinkId: createdDrink.id,
                        sizeId: size.id,
                        price: 0,
                    })),
                });
            }

            return createdDrink;
        });

        return NextResponse.json(
            {
                data: drink,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("[POST /api/drinks]", error);

        return NextResponse.json(
            {
                message: "Failed to create drink",
            },
            { status: 500 },
        );
    }
}
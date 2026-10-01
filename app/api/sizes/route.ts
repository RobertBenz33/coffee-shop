import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const includeInactive =
            request.nextUrl.searchParams.get("includeInactive") === "true";

        const sizes = await prisma.size.findMany({
            where: includeInactive
                ? undefined
                : { isActive: true },
            include: {
                drinks: {
                    where: includeInactive
                        ? undefined
                        : {
                            drink: {
                                isActive: true,
                            },
                        },
                    include: {
                        drink: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({
            data: sizes,
        });
    } catch (error) {
        console.error("[GET /api/sizes]", error);

        return NextResponse.json(
            {
                message: "Failed to fetch sizes",
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
                    message: "Size name is required",
                },
                { status: 400 },
            );
        }

        const existingSize = await prisma.size.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (existingSize) {
            return NextResponse.json(
                {
                    message: "Size already exists",
                },
                { status: 409 },
            );
        }

        const size = await prisma.$transaction(async (tx) => {
            const createdSize = await tx.size.create({
                data: {
                    name,
                    isActive: true,
                },
            });

            const activeDrinks = await tx.drink.findMany({
                where: {
                    isActive: true,
                },
            });

            if (activeDrinks.length > 0) {
                await tx.drinkSize.createMany({
                    data: activeDrinks.map((drink) => ({
                        drinkId: drink.id,
                        sizeId: createdSize.id,
                        price: 0,
                    })),
                });
            }

            return createdSize;
        });

        return NextResponse.json(
            {
                data: size,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("[POST /api/sizes]", error);

        return NextResponse.json(
            {
                message: "Failed to create size",
            },
            { status: 500 },
        );
    }
}
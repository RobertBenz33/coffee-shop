import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IngredientType } from "@/src/generated/prisma/enums";

export async function GET(request: NextRequest) {
    try {
        const includeInactive =
            request.nextUrl.searchParams.get("includeInactive") === "true";

        const ingredients = await prisma.ingredient.findMany({
            where: includeInactive
                ? undefined
                : {
                    isActive: true,
                },
            orderBy: [
                {
                    type: "asc",
                },
                {
                    name: "asc",
                },
            ],
        });

        return NextResponse.json({
            data: ingredients,
        });
    } catch (error) {
        console.error("[GET /api/ingredients]", error);

        return NextResponse.json(
            {
                message: "Failed to fetch ingredients",
            },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const name = String(body.name ?? "").trim();
        const type = body.type;
        const price = Number(body.price ?? 0);

        if (!name) {
            return NextResponse.json(
                {
                    message: "Ingredient name is required",
                },
                { status: 400 },
            );
        }

        if (
            type !== IngredientType.SYRUP &&
            type !== IngredientType.TOPPING
        ) {
            return NextResponse.json(
                {
                    message: "Ingredient type must be SYRUP or TOPPING",
                },
                { status: 400 },
            );
        }

        if (!Number.isFinite(price) || price < 0) {
            return NextResponse.json(
                {
                    message: "Price must be a valid non-negative number",
                },
                { status: 400 },
            );
        }

        const existingIngredient =
            await prisma.ingredient.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: "insensitive",
                    },
                    type,
                },
            });

        if (existingIngredient) {
            return NextResponse.json(
                {
                    message: "Ingredient already exists",
                },
                { status: 409 },
            );
        }

        const ingredient = await prisma.ingredient.create({
            data: {
                name,
                type,
                price,
                isActive: true,
            },
        });

        return NextResponse.json(
            {
                data: ingredient,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("[POST /api/ingredients]", error);

        return NextResponse.json(
            {
                message: "Failed to create ingredient",
            },
            { status: 500 },
        );
    }
}
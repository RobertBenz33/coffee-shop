import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const drinkSizes = await prisma.drinkSize.findMany({
            where: {
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
            orderBy: [
                {
                    drink: {
                        name: "asc",
                    },
                },
                {
                    size: {
                        name: "asc",
                    },
                },
            ],
        });

        return NextResponse.json({
            data: drinkSizes,
        });
    } catch (error) {
        console.error("[GET /api/pricing/drink-sizes]", error);

        return NextResponse.json(
            {
                message: "Failed to fetch drink size pricing",
            },
            {
                status: 500,
            },
        );
    }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    _request: NextRequest,
    context: RouteContext,
) {
    try {
        const { id } = await context.params;

        const order = await prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                items: {
                    include: {
                        ingredients: true,
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                {
                    message: "Order not found",
                },
                { status: 404 },
            );
        }

        return NextResponse.json({
            data: order,
        });
    } catch (error) {
        console.error("[GET /api/orders/:id]", error);

        return NextResponse.json(
            {
                message: "Failed to fetch order",
            },
            { status: 500 },
        );
    }
}
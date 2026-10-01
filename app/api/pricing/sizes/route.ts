import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const name = String(body.name ?? "").trim();

        if (!name) {
            return NextResponse.json(
                {
                    message: "Size name is required",
                },
                {
                    status: 400,
                },
            );
        }

        const size = await prisma.size.create({
            data: {
                name,
            },
        });

        return NextResponse.json(
            {
                data: size,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("[POST /api/pricing/sizes]", error);

        return NextResponse.json(
            {
                message: "Failed to create size",
            },
            {
                status: 500,
            },
        );
    }
}
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

        const existingSize = await prisma.size.findUnique({
            where: {
                id,
            },
        });

        if (!existingSize) {
            return NextResponse.json(
                {
                    message: "Size not found",
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
                        message: "Size name cannot be empty",
                    },
                    { status: 400 },
                );
            }

            const duplicate = await prisma.size.findFirst({
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
                        message: "Size already exists",
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

        const size = await prisma.size.update({
            where: {
                id,
            },
            data,
        });

        return NextResponse.json({
            data: size,
        });
    } catch (error) {
        console.error("[PATCH /api/sizes/:id]", error);

        return NextResponse.json(
            {
                message: "Failed to update size",
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

        const size = await prisma.size.findUnique({
            where: {
                id,
            },
        });

        if (!size) {
            return NextResponse.json(
                {
                    message: "Size not found",
                },
                { status: 404 },
            );
        }

        await prisma.size.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            message: "Size deleted successfully",
        });
    } catch (error) {
        console.error("[DELETE /api/sizes/:id]", error);

        return NextResponse.json(
            {
                message: "Failed to delete size",
            },
            { status: 500 },
        );
    }
}
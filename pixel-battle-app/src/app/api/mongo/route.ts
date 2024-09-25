import { NextResponse } from "next/server";
import React from "react";
import prisma from "@/app/utils/connection";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
    try {
        const canvas = await prisma.canvas.findMany();

        return NextResponse.json(canvas);
    } catch (error) {
        return NextResponse.json(
            { error: "Error loading canvas" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { row, col, color, isUpdate } = await request.json();

        if (!row || !col || !color) {
            return NextResponse.json(
                { error: "Invalid data" },
                { status: 400 }
            );
        }

        if (isUpdate) {
            const response = await prisma.canvas.update({
                where: {
                    x_y: {
                        x: row,
                        y: col
                    }
                },
                data: {
                    color
                }
            });

            return NextResponse.json(response);
        } else {
            const response = await prisma.canvas.create({
                data: {
                    x: row,
                    y: col,
                    color
                }
            });

            return NextResponse.json(response);
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Error during pixel update" },
            { status: 500 }
        );
    }


}
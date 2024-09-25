import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

export async function GET(request: Request) {
    const file = await readFile("src/public/canvas.json", "utf8");

    if (file) {
        return NextResponse.json({
            status: 200,
            canvasGrid: file,
        })
    }

    return NextResponse.json(
        { error: "Error loading canvas" },
        { status: 500 }
    );
}

export async function POST(request: Request) {
    const file = await readFile("src/public/canvas.json", "utf8");
    const { row, col, color } = await request.json();

    if (file) {
        const updated = JSON.parse(file);
        updated[row][col] = color;

        await writeFile("src/public/canvas.json", JSON.stringify(updated));
        return NextResponse.json(file);
    }

    return NextResponse.json(
        { error: "Error creating record" },
        { status: 500 }
    );
}
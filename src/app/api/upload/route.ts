// src/app/api/upload/route.ts
// Stores uploaded images temporarily in memory and returns a base64 data URL.
// These URLs are passed to the enquiry route which attaches them to the email.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

        const bytes  = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const dataUrl = `data:${file.type};base64,${base64}`;

        return NextResponse.json({ url: dataUrl, name: file.name, type: file.type });
    } catch (err) {
        console.error("[upload]", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
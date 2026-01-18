import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import SystemConfig from "@/models/SystemConfig";
import { UserRole } from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { key, value } = await req.json();

        if (!key || value === undefined) {
            return new NextResponse("Key and Value are required", { status: 400 });
        }

        await connectDB();

        const config = await SystemConfig.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );

        return NextResponse.json(config);
    } catch (error) {
        console.error("[CONFIG_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
            // Maybe allow read for others if needed? For now strict.
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectDB();
        const configs = await SystemConfig.find({});
        return NextResponse.json(configs);
    } catch (error) {
        console.error("[CONFIG_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

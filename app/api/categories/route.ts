import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { UserRole } from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== UserRole.COACH) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { name } = await req.json();

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        await connectDB();

        const category = await Category.create({
            name,
            createdBy: session.user.id,
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== UserRole.COACH) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectDB();

        const categories = await Category.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(session.user.id) } },
            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'categoryId',
                    as: 'questions'
                }
            },
            {
                $project: {
                    name: 1,
                    createdAt: 1,
                    questionCount: { $size: '$questions' }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        return NextResponse.json(categories);
    } catch (error) {
        console.error("[CATEGORIES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

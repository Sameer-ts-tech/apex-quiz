import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Question from "@/models/Question";
import { UserRole } from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== UserRole.COACH) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { text, image, options, categoryId, defaultScore } = body;

        if (!text || !options || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        await connectDB();

        const question = await Question.create({
            text,
            image, // Add question image
            options, // Options now contain image fields
            categoryId,
            defaultScore: defaultScore || 1,
            createdBy: session.user.id,
        });

        return NextResponse.json(question);
    } catch (error) {
        console.error("[QUESTIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== UserRole.COACH) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");

        await connectDB();

        const query: any = { createdBy: session.user.id };
        if (categoryId) {
            query.categoryId = categoryId;
        }

        const questions = await Question.find(query)
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json(questions);
    } catch (error) {
        console.error("[QUESTIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

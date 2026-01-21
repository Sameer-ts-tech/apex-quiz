
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User, { UserRole } from "@/models/User";
import Quiz from "@/models/Quiz";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== UserRole.COACH) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Fetch stats in parallel
        const [studentCount, quizCount] = await Promise.all([
            User.countDocuments({
                coachingId: session.user.id,
                role: UserRole.STUDENT,
            }),
            Quiz.countDocuments({
                createdBy: session.user.id,
            }),
        ]);

        return NextResponse.json({
            studentCount,
            quizCount,
        });
    } catch (error) {
        console.error("Error fetching coach stats:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

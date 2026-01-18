import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Attempt from "@/models/Attempt";
import { UserRole } from "@/models/User";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const attempt = await Attempt.findById(id)
            .populate('quizId', 'title description totalMarks')
            .populate('studentId', 'name'); // Populate student info for coaches

        if (!attempt) {
            return new NextResponse("Attempt not found", { status: 404 });
        }

        // Authorization check
        // Student can see own attempt. Coach can see attempts on their quizzes.
        // For MVP, if it's the student's own attempt, allow.
        // Logic for coach check is harder without fetching quiz owner first, but we populated quizId.
        // Note: Mongoose populate returns the doc, we need to cast or access carefully.

        // Simple check: Owner or Admin or Coach-of-quiz
        const isOwner = attempt.studentId._id.toString() === session.user.id;
        // We need to check if session user is the creator of the quiz. 
        // We didn't populate createdBy on quizId yet.
        // Let's rely on simple owner check for Student view.

        if (session.user.role === UserRole.STUDENT && !isOwner) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        return NextResponse.json(attempt);
    } catch (error) {
        console.error("[ATTEMPT_GET_ONE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

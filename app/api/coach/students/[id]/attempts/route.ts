import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Attempt from "@/models/Attempt";
import Quiz from "@/models/Quiz";
import User, { UserRole } from "@/models/User";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== UserRole.COACH) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id: studentId } = await params;
        if (!studentId) {
            return new NextResponse("Student ID required", { status: 400 });
        }

        // Ensure Quiz schema is registered
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        Quiz;

        await connectDB();

        // Security Check: Ensure this student belongs to this coach
        const student = await User.findOne({
            _id: studentId,
            coachingId: session.user.id
        });

        if (!student) {
            return new NextResponse("Student not found or not authorized", { status: 404 });
        }

        // Fetch attempts
        const attempts = await Attempt.find({ studentId })
            .sort({ createdAt: -1 })
            .populate('quizId', 'title totalMarks mode');

        return NextResponse.json({
            student: {
                _id: student._id,
                name: student.name,
                email: student.email,
            },
            attempts
        });

    } catch (error) {
        console.error("[STUDENT_ATTEMPTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Quiz, { QuizMode } from "@/models/Quiz";
import Question from "@/models/Question";
import { UserRole } from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== UserRole.COACH) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title, description, duration, mode, criteria, questions } = body;

        if (!title || !mode) {
            return new NextResponse("Title and mode are required", { status: 400 });
        }

        await connectDB();

        let selectedQuestions: { questionId: any, score: number }[] = [];
        let totalMarks = 0;

        if (mode === QuizMode.RANDOM) {
            // console.log("Random Mode Criteria Received:", JSON.stringify(criteria));
            // criteria: [{ categoryId, count }]
            for (const item of criteria) {
                // console.log(`Processing criteria: Category ${item.categoryId}, Count ${item.count}`);
                const randomQuestions = await Question.aggregate([
                    { $match: { categoryId: new mongoose.Types.ObjectId(item.categoryId), createdBy: new mongoose.Types.ObjectId(session.user.id) } },
                    { $sample: { size: item.count } }
                ]);

                // console.log(`Found ${randomQuestions.length} questions for category ${item.categoryId}`);

                const mapped = randomQuestions.map((q: any) => ({
                    questionId: q._id,
                    score: q.defaultScore || 1
                }));
                selectedQuestions.push(...mapped);
            }
            // console.log(`Total selected questions: ${selectedQuestions.length}`);
        } else {
            // Manual mode: questions array of ids
            // Validate questions exist and calculate score
            // Assuming input is just array of question IDs for simplicity or objects
            // Let's expect array of { questionId, score } or just IDs and fetch default scores
            // For this MVP, let's expect an array of questionIds and we fetch default scores.

            if (questions && questions.length > 0) {
                const questionDocs = await Question.find({
                    _id: { $in: questions },
                    createdBy: session.user.id
                });

                selectedQuestions = questionDocs.map(q => ({
                    questionId: q._id,
                    score: q.defaultScore
                }));
            }
        }

        totalMarks = selectedQuestions.reduce((acc, q) => acc + q.score, 0);

        const quiz = await Quiz.create({
            title,
            description,
            createdBy: session.user.id,
            mode,
            duration: duration || 60,
            questions: selectedQuestions,
            totalMarks,
            isActive: true, // Default to active or maybe 'DRAFT'
        });

        // Update usage counts (Revenue calculation logic hook)
        // We update usageCount when a Quiz is CREATED? Or when ATTEMPTED?
        // Requirement: "calculated by the question that have selected or attempted"
        // Usually usage is "attempted", but if the teacher "uses" it in a quiz, maybe that counts?
        // Let's update it on ATTEMPT for accuracy, or here if "Selection" is the metric.
        // "calculated by the question that have selected or attempted" -> ambigous. 
        // Let's stick to updating it on Attempt for now as that represents student usage.
        // But wait, "selected... by the student"? No, "selected... OR attempted by the student".
        // Actually, "selected" implies the teacher selected it for the paper.
        // Let's update usage count here too? No, usually usage-based billing is per-student-attempt.
        // I will increment usageCount on Attempt.

        return NextResponse.json(quiz);
    } catch (error) {
        console.error("[QUIZZES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectDB();

        let query = {};
        // If coach, show their own quizzes.
        if (session.user.role === UserRole.COACH) {
            query = { createdBy: session.user.id };
        }
        // If student, show only quizzes created by their coach
        else if (session.user.role === UserRole.STUDENT) {
            if ((session.user as any).coachingId) {
                query = { isActive: true, createdBy: (session.user as any).coachingId };
            } else {
                // If no coachingId (legacy or error), maybe show nothing or public quizzes? 
                // For strict isolation, show nothing.
                query = { _id: { $exists: false } };
            }
        }
        // Super admin might want to see all?
        else if (session.user.role === UserRole.SUPER_ADMIN) {
            query = {};
        }

        const quizzes = await Quiz.find(query)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name');

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error("[QUIZZES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

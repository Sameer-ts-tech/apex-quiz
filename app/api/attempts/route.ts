import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Attempt from "@/models/Attempt";
import Quiz from "@/models/Quiz";
import Question from "@/models/Question";
import { UserRole } from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== UserRole.STUDENT) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { quizId, answers } = body;
        // answers: [{ questionId, selectedOptionId }]

        if (!quizId || !answers) {
            return new NextResponse("Missing data", { status: 400 });
        }

        await connectDB();

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

        // Fetch all questions in the quiz to verify answers
        // We need to know which option is correct for each question
        // quiz.questions has { questionId, score }

        // Get question details
        const questionIds = answers.map((a: any) => a.questionId);
        const questions = await Question.find({ _id: { $in: questionIds } });

        let totalScore = 0;

        // Process answers
        const processedAnswers = [];

        for (const ans of answers) {
            const question = questions.find(q => q._id.toString() === ans.questionId);
            if (!question) continue;

            // Find the correct option
            const correctOption = question.options.find(opt => opt.isCorrect);

            // Check if selected option is correct
            // Assuming selectedOptionId is the _id of the option
            const isCorrect = correctOption && String((correctOption as any)._id) === String(ans.selectedOptionId);

            // Get score for this question from Quiz config
            const quizQuestionConfig = quiz.questions.find((qq: any) => qq.questionId.toString() === question._id.toString());
            const questionPoints = quizQuestionConfig ? quizQuestionConfig.score : (question.defaultScore || 1);

            if (isCorrect) {
                totalScore += questionPoints;
            }

            processedAnswers.push({
                questionId: question._id,
                selectedOptionId: ans.selectedOptionId
            });

            // Revenue Logic: Increment usage count for the question
            // We increment it for every attempt involving this question
            await Question.findByIdAndUpdate(question._id, { $inc: { usageCount: 1 } });
        }

        const attempt = await Attempt.create({
            studentId: session.user.id,
            quizId,
            answers: processedAnswers,
            score: totalScore,
            completedAt: new Date()
        });

        return NextResponse.json(attempt);

    } catch (error) {
        console.error("[ATTEMPTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    // Return attempts for the current user
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Unauthorized", { status: 401 });

        await connectDB();

        const queries: any = {};

        if (session.user.role === UserRole.STUDENT) {
            queries.studentId = session.user.id;
        } else if (session.user.role === UserRole.COACH) {
            // Coach sees attempts for their quizzes?
            // Complex query: Find quizzes by this coach, then attempts for those quizzes
            const coachQuizzes = await Quiz.find({ createdBy: session.user.id }).select('_id');
            const quizIds = coachQuizzes.map(q => q._id);
            queries.quizId = { $in: quizIds };
        }

        const attempts = await Attempt.find(queries)
            .sort({ createdAt: -1 })
            .populate('quizId', 'title totalMarks')
            .populate('studentId', 'name email');

        return NextResponse.json(attempts);
    } catch (error) {
        console.error("[ATTEMPTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

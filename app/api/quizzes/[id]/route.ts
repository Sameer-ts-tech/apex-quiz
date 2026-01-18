import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';
import { UserRole } from '@/models/User';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const quiz = await Quiz.findById(id).populate('questions.questionId');

        if (!quiz) {
            return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
        }

        // Access Control
        if (token.role === UserRole.COACH) {
            if (quiz.createdBy.toString() !== token.id) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
            }
        } else if (token.role === UserRole.STUDENT) {
            if (!quiz.isActive) {
                return NextResponse.json({ message: 'Quiz is not active' }, { status: 403 });
            }

            const isOwnCoachQuiz = token.coachingId && quiz.createdBy.toString() === token.coachingId;

            // Logic:
            // 1. If Quiz is Free -> Everyone can access.
            // 2. If Quiz is Paid -> Only Own Coach's students can access freely. Everyone else pays.

            if (quiz.isPaid) {
                if (!isOwnCoachQuiz) {
                    return NextResponse.json({ message: 'Payment Required' }, { status: 402 });
                }
            }

            // If Free (!quiz.isPaid), we allow access.
            // Converting strict isolation to open marketplace model for free quizzes.

            // For Global Students accessing Paid Quizzes, we'd need a "Purchase" check here.
            // For now, we just pass through.
        }

        // Flatten the questions structure for the frontend
        const quizObj = quiz.toObject();
        const formattedQuestions = quizObj.questions
            .filter((q: any) => q.questionId) // Filter out nulls (deleted questions)
            .map((q: any) => ({
                _id: q.questionId._id,
                text: q.questionId.text,
                image: q.questionId.image, // Add image
                options: q.questionId.options, // Contains text and image
                score: q.score,
                type: q.questionId.type
            }));

        const formattedQuiz = {
            ...quizObj,
            questions: formattedQuestions
        };

        return NextResponse.json(formattedQuiz);

    } catch (error) {
        console.error('Error fetching quiz:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== UserRole.COACH) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { isActive } = await req.json();

        if (typeof isActive !== 'boolean') {
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        await connectDB();

        const quiz = await Quiz.findOne({ _id: id, createdBy: token.id });

        if (!quiz) {
            return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
        }

        quiz.isActive = isActive;
        await quiz.save();

        return NextResponse.json({ message: 'Quiz updated successfully', quiz });
    } catch (error) {
        console.error('Error updating quiz:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

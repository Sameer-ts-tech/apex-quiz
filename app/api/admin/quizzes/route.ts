import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@/models/User';

export async function GET(req: Request) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== UserRole.SUPER_ADMIN) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const quizzes = await Quiz.find({})
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json(quizzes);
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== UserRole.SUPER_ADMIN) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId, isPaid } = await req.json();

        await connectDB();
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { isPaid },
            { new: true }
        );

        return NextResponse.json(updatedQuiz);
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

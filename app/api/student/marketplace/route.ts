import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';
import User from '@/models/User'; // Ensure User model is loaded

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        await connectDB();

        const query: any = { isActive: true };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const quizzes = await Quiz.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name'); // Show who created it

        const total = await Quiz.countDocuments(query);
        const hasMore = skip + quizzes.length < total;

        return NextResponse.json({
            quizzes,
            hasMore,
            total,
            currentPage: page
        });
    } catch (error) {
        console.error('Marketplace API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

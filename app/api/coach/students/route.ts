import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db';
import User, { UserRole } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== UserRole.COACH) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const students = await User.find({ role: UserRole.STUDENT, coachingId: token.id }).select('-password').sort({ createdAt: -1 });

        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== UserRole.COACH) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, email, password, phoneNumber } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Student already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = await User.create({
            name,
            email,
            password: hashedPassword,
            role: UserRole.STUDENT,
            coachingId: token.id, // Link to the creating Coach
            status: 'APPROVED',
            phoneNumber
        });

        return NextResponse.json({ message: 'Student created successfully', studentId: newStudent._id }, { status: 201 });
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

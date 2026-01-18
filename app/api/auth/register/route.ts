import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User, { UserRole } from '@/models/User';

export async function POST(req: Request) {
    try {
        const { name, email, password, role, phoneNumber } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (![UserRole.COACH, UserRole.STUDENT].includes(role)) {
            return NextResponse.json({ message: 'Invalid role selection' }, { status: 400 });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const status = role === UserRole.COACH ? 'PENDING' : 'APPROVED';

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            status,
            phoneNumber,
        });

        return NextResponse.json({ message: 'User created successfully', userId: newUser._id }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

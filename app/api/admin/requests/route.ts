import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db';
import User, { UserRole } from '@/models/User';

export async function GET(req: Request) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== UserRole.SUPER_ADMIN) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const pendingCoaches = await User.find({ role: UserRole.COACH, status: 'PENDING' }).sort({ createdAt: -1 });

        return NextResponse.json(pendingCoaches);
    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== UserRole.SUPER_ADMIN) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { userId, status, rejectionReason } = await req.json();

        if (!userId || !status || !['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        await connectDB();

        const updateData: any = { status };
        if (status === 'REJECTED' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Coach ${status.toLowerCase()} successfully`, user: updatedUser });

    } catch (error) {
        console.error('Error updating status:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

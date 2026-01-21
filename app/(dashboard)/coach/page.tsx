import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";
import connectDB from "@/lib/db";
import User, { UserRole } from "@/models/User";
import Quiz from "@/models/Quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getStats() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== UserRole.COACH) {
        return {
            activeStudents: 0,
            totalQuizzes: 0,
        };
    }

    await connectDB();
    const activeStudents = await User.countDocuments({
        coachingId: session.user.id,
        role: UserRole.STUDENT
    });

    const totalQuizzes = await Quiz.countDocuments({
        createdBy: session.user.id
    });

    return {
        activeStudents,
        totalQuizzes
    };
}

export default async function CoachDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Coach Dashboard</h1>
                <Link href="/coach/quizzes/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Quiz
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeStudents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

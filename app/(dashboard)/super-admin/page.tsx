import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import connectDB from "@/lib/db";
import User, { UserRole } from "@/models/User";
import Question from "@/models/Question";
import SystemConfig from "@/models/SystemConfig";

// Server component to fetch stats directly
async function getStats() {
    await connectDB();
    const coachCount = await User.countDocuments({ role: UserRole.COACH });
    const questionCount = await Question.countDocuments({});
    const revenueConfig = await SystemConfig.findOne({ key: 'REVENUE_SHARE_PERCENTAGE' });

    // Calculate total usage
    const totalUsageData = await Question.aggregate([
        { $group: { _id: null, totalUsage: { $sum: "$usageCount" } } }
    ]);
    const totalUsage = totalUsageData[0]?.totalUsage || 0;

    return {
        coachCount,
        questionCount,
        revenueShare: revenueConfig?.value || 90,
        totalUsage
    };
}

export default async function SuperAdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">Super Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Coaching Centers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.coachCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.questionCount.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Question Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsage.toLocaleString()}</div>
                        <p className="text-xs text-gray-500">Global attempts on questions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Share</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.revenueShare}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed tables or charts could go here */}
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>System Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">Platform is active and monitoring {stats.coachCount} coaching centers.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

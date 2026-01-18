import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import connectDB from "@/lib/db";
import User, { UserRole } from "@/models/User";
import { User as UserIcon, Mail, Calendar } from "lucide-react";

async function getCoaches() {
    await connectDB();
    const coaches = await User.find({ role: UserRole.COACH, status: 'APPROVED' }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(coaches)); // Serializable for Server Component
}

export default async function CoachesPage() {
    const coaches = await getCoaches();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">Coaching Centers</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {coaches.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-100">
                        <p className="text-gray-500">No coaching centers registered yet.</p>
                    </div>
                ) : (
                    coaches.map((coach: any) => (
                        <Card key={coach._id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <UserIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{coach.name}</CardTitle>
                                        <p className="text-xs text-gray-500">ID: {coach._id}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                    {coach.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    Joined: {new Date(coach.createdAt).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Play } from "lucide-react";

export default function StudentDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">Student Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {/* Example Quiz Card */}
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle>Physics - Chapter 1</CardTitle>
                        <div className="text-sm text-gray-500">Duration: 60 mins • 30 marks</div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                            Comprehensive test covering Kinematics and Newtons Laws of Motion.
                        </p>
                        <Button className="w-full">
                            <Play className="mr-2 h-4 w-4" /> Start Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

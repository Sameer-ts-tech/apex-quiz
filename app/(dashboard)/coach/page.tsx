import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function CoachDashboard() {
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
                        <div className="text-2xl font-bold">42</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

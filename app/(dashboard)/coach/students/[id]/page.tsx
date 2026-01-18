'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader2, ArrowLeft, Trophy, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function StudentPerformancePage() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params?.id) {
            fetchPerformance(params.id as string);
        }
    }, [params]);

    const fetchPerformance = async (studentId: string) => {
        try {
            const res = await fetch(`/api/coach/students/${studentId}/attempts`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                console.error("Failed to fetch performance data");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div className="p-8 text-center">Student not found or no access.</div>;

    const { student, attempts } = data;

    // Calculate stats
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
        ? Math.round(attempts.reduce((acc: number, curr: any) => acc + (curr.score / curr.quizId.totalMarks * 100), 0) / totalAttempts)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/coach/students">
                    <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Students</Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Student Performance</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Student Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p><span className="font-medium">Name:</span> {student.name}</p>
                            <p><span className="font-medium">Email:</span> {student.email}</p>
                            <div className="pt-4 flex gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg flex-1">
                                    <p className="text-sm text-blue-600 font-medium uppercase">Quizzes Taken</p>
                                    <p className="text-3xl font-bold text-blue-900">{totalAttempts}</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg flex-1">
                                    <p className="text-sm text-green-600 font-medium uppercase">Avg. Score</p>
                                    <p className="text-3xl font-bold text-green-900">{averageScore}%</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Quiz Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                    {attempts.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No quiz attempts yet.</p>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Quiz Title</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Score</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {attempts.map((attempt: any) => {
                                        const percentage = Math.round((attempt.score / attempt.quizId.totalMarks) * 100);
                                        const isPassed = percentage >= 50;
                                        return (
                                            <tr key={attempt._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle font-medium">{attempt.quizId.title}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3 text-gray-400" />
                                                        {new Date(attempt.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {attempt.score} / {attempt.quizId.totalMarks} <span className="text-xs text-gray-500">({percentage}%)</span>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${isPassed ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`}>
                                                        {isPassed ? 'Passed' : 'Failed'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

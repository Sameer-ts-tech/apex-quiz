'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Loader2, ArrowLeft, Trophy, XCircle, RotateCcw } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AttemptResultPage() {
    const params = useParams();
    const [attempt, setAttempt] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params?.id) fetchAttempt(params.id as string);
    }, [params]);

    const fetchAttempt = async (id: string) => {
        try {
            const res = await fetch(`/api/attempts/${id}`);
            if (res.ok) {
                const data = await res.json();
                setAttempt(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
    if (!attempt) return <div className="text-center p-10">Result not found</div>;

    const percentage = Math.round((attempt.score / attempt.quizId.totalMarks) * 100);
    const isPassed = percentage >= 50; // Arbitrary pass mark or percentage

    return (
        <div className="max-w-xl mx-auto py-10">
            <Card className="text-center border-t-8 border-t-blue-500 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Quiz Results</CardTitle>
                    <p className="text-gray-500">{attempt.quizId.title}</p>
                </CardHeader>
                <CardContent className="space-y-8 py-8">
                    <div className="flex justify-center">
                        {isPassed ? (
                            <div className="bg-yellow-100 p-6 rounded-full">
                                <Trophy className="h-16 w-16 text-yellow-600" />
                            </div>
                        ) : (
                            <div className="bg-red-100 p-6 rounded-full">
                                <XCircle className="h-16 w-16 text-red-600" />
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="text-5xl font-bold text-gray-900 mb-2">{attempt.score} <span className="text-2xl text-gray-400">/ {attempt.quizId.totalMarks}</span></div>
                        <p className={`text-lg font-medium ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
                            {isPassed ? 'Great Job! You Passed.' : 'Keep Studying! You can do better.'}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Score: {percentage}%</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-4 rounded-lg">
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Started At</p>
                            <p className="font-medium text-sm">{new Date(attempt.startedAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Completed At</p>
                            <p className="font-medium text-sm">{new Date(attempt.completedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4 bg-gray-50 p-6">
                    <Link href="/student/quizzes">
                        <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes</Button>
                    </Link>
                    {/* Retry logic could go here if allowed */}
                </CardFooter>
            </Card>
        </div>
    );
}

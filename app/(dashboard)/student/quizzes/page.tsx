'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Loader2, Play, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Quiz {
    _id: string;
    title: string;
    description: string;
    duration: number;
    totalMarks: number;
    createdBy: { name: string };
    questions: any[];
}

export default function StudentQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch('/api/quizzes');
            if (res.ok) {
                const data = await res.json();
                setQuizzes(data);
            }
        } catch (error) {
            console.error('Failed to fetch quizzes', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">Available Quizzes</h1>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            ) : quizzes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                    <p className="text-gray-500">No active quizzes found at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <Card key={quiz._id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{quiz.createdBy?.name || 'Coach'}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{quiz.description || 'No description provided.'}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1 text-blue-500" />
                                        {quiz.duration} mins
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                                        {quiz.totalMarks} Marks
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Link href={`/student/quizzes/${quiz._id}`} className="w-full">
                                    <Button className="w-full">
                                        <Play className="mr-2 h-4 w-4" /> Start Attempt
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

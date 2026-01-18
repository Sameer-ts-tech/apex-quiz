'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader2, Plus, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Quiz {
    _id: string;
    title: string;
    duration: number;
    totalMarks: number;
    questions: any[];
    mode: string;
    isActive: boolean;
    createdAt: string;
}

export default function QuizzesPage() {
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

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/quizzes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (res.ok) {
                setQuizzes(quizzes.map(q =>
                    q._id === id ? { ...q, isActive: !currentStatus } : q
                ));
            }
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Your Quizzes</h1>
                <Link href="/coach/quizzes/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Quiz
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                        </div>
                    ) : quizzes.length === 0 ? (
                        <div className="text-center py-10 px-6">
                            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No quizzes yet</h3>
                            <p className="text-gray-500 mb-6">Create your first quiz to start assessing students.</p>
                            <Link href="/coach/quizzes/create">
                                <Button>Create Quiz</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {quizzes.map((quiz) => (
                                <div key={quiz._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-1">
                                            <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {quiz.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                            <span className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" /> {quiz.duration} mins
                                            </span>
                                            <span>•</span>
                                            <span>{quiz.questions.length} Questions</span>
                                            <span>•</span>
                                            <span>{quiz.totalMarks} Marks</span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 uppercase tracking-wide">
                                                {quiz.mode}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant={quiz.isActive ? "outline" : "default"}
                                            size="sm"
                                            onClick={() => toggleStatus(quiz._id, quiz.isActive)}
                                            className={quiz.isActive ? "text-red-600 border-red-200 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
                                        >
                                            {quiz.isActive ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

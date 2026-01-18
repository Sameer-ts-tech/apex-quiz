'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader2, Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';

interface Attempt {
    _id: string;
    quizId: { title: string; totalMarks: number };
    score: number;
    completedAt: string;
}

export default function HistoryPage() {
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/attempts');
            if (res.ok) {
                const data = await res.json();
                setAttempts(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">Your History</h1>

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                        </div>
                    ) : attempts.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No attempts yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {attempts.map((attempt) => (
                                <div key={attempt._id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{attempt.quizId?.title || 'Unknown Quiz'}</h3>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(attempt.completedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="text-right mr-4">
                                            <p className="text-sm text-gray-500">Score</p>
                                            <p className="font-bold text-gray-900">{attempt.score} / {attempt.quizId?.totalMarks}</p>
                                        </div>
                                        <div className="p-2 bg-blue-50 rounded-full">
                                            <Trophy className="h-5 w-5 text-blue-600" />
                                        </div>
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

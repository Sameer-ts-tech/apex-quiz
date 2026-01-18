'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader2, DollarSign, Unlock, IndianRupee } from 'lucide-react';

interface Quiz {
    _id: string;
    title: string;
    createdBy: { name: string, email: string };
    isPaid: boolean;
    isActive: boolean;
    createdAt: string;
}

export default function AdminQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch('/api/admin/quizzes');
            if (res.ok) {
                const data = await res.json();
                setQuizzes(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const togglePaidStatus = async (quizId: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/quizzes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quizId, isPaid: !currentStatus }),
            });

            if (res.ok) {
                setQuizzes(quizzes.map(q =>
                    q._id === quizId ? { ...q, isPaid: !currentStatus } : q
                ));
            }
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">All Quizzes</h1>

            <div className="grid gap-4">
                {quizzes.map((quiz) => (
                    <Card key={quiz._id} className="flex flex-row items-center justify-between p-4">
                        <div>
                            <h3 className="font-semibold text-lg">{quiz.title}</h3>
                            <p className="text-sm text-gray-500">
                                By: {quiz.createdBy?.name} ({quiz.createdBy?.email})
                            </p>
                            <div className="flex gap-2 mt-2">
                                <Badge variant={quiz.isActive ? 'default' : 'secondary'}>
                                    {quiz.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge variant={quiz.isPaid ? 'destructive' : 'outline'} className={quiz.isPaid ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                                    {quiz.isPaid ? 'PAID' : 'FREE'}
                                </Badge>
                            </div>
                        </div>

                        <Button
                            variant={quiz.isPaid ? "secondary" : "primary"}
                            onClick={() => togglePaidStatus(quiz._id, quiz.isPaid)}
                            className="w-32 border"
                        >
                            {quiz.isPaid ? (
                                <><Unlock className="mr-2 h-4 w-4" /> Make Free</>
                            ) : (
                                <><IndianRupee className="mr-2 h-4 w-4" /> Make Paid</>
                            )}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}

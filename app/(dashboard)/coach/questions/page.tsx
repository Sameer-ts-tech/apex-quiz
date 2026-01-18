'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader2, Plus, Filter } from 'lucide-react';
import Link from 'next/link';

interface Question {
    _id: string;
    text: string;
    categoryId: { _id: string; name: string };
    defaultScore: number;
}

export default function QuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch('/api/questions');
            if (res.ok) {
                const data = await res.json();
                setQuestions(data);
            }
        } catch (error) {
            console.error('Failed to fetch questions', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Question Bank</h1>
                <Link href="/coach/questions/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 mb-4">No questions added yet.</p>
                            <Link href="/coach/questions/new">
                                <Button variant="outline">Create your first question</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {questions.map((q) => (
                                <div key={q._id} className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:border-blue-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {q.categoryId?.name || 'Uncategorized'}
                                        </span>
                                        <span className="text-xs text-gray-500">Score: {q.defaultScore}</span>
                                    </div>
                                    <p className="text-gray-900 font-medium">{q.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

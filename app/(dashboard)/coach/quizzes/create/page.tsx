'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Loader2, ArrowLeft, Save, Plus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateQuizPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: Details, 2: Questions

    // Quiz State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(60);
    const [mode, setMode] = useState<'MANUAL' | 'RANDOM'>('MANUAL');

    // Manual Mode State
    const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

    useEffect(() => {
        if (step === 2 && mode === 'MANUAL') {
            fetchQuestions();
        }
    }, [step, mode]);

    const fetchQuestions = async () => {
        try {
            const res = await fetch('/api/questions');
            if (res.ok) {
                const data = await res.json();
                setAvailableQuestions(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggleQuestion = (id: string) => {
        if (selectedQuestionIds.includes(id)) {
            setSelectedQuestionIds(selectedQuestionIds.filter(qId => qId !== id));
        } else {
            setSelectedQuestionIds([...selectedQuestionIds, id]);
        }
    };

    const handleSubmit = async () => {
        if (!title) return;
        setIsSubmitting(true);

        try {
            const payload: any = {
                title,
                description,
                duration,
                mode,
            };

            if (mode === 'MANUAL') {
                payload.questions = selectedQuestionIds;
            } else {
                // Random mode logic would go here (categories + count)
                // For MVP, implementing Manual first as requested
                payload.questions = []; // Placeholder
            }

            const res = await fetch('/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/coach/quizzes');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/coach/quizzes">
                    <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Create New Quiz</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Steps */}
                <div className="md:col-span-1 space-y-2">
                    <div className={`p-4 rounded-lg cursor-pointer ${step === 1 ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'}`} onClick={() => setStep(1)}>
                        <h3 className={`font-medium ${step === 1 ? 'text-blue-700' : 'text-gray-600'}`}>1. Details & Config</h3>
                        <p className="text-xs text-gray-400 mt-1">Title, time, and type</p>
                    </div>
                    <div className={`p-4 rounded-lg ${step === 2 ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white text-gray-400'}`}>
                        <h3 className={`font-medium ${step === 2 ? 'text-blue-700' : ''}`}>2. Select Questions</h3>
                        <p className="text-xs text-gray-400 mt-1">Add questions to quiz</p>
                    </div>
                </div>

                {/* Form Area */}
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="p-6">
                            {step === 1 ? (
                                <div className="space-y-4">
                                    <Input
                                        label="Quiz Title"
                                        placeholder="e.g. Physics Mid-Term"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            rows={3}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                    <Input
                                        type="number"
                                        label="Duration (minutes)"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                    />
                                    {/* Mode Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Selection Mode</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setMode('MANUAL')}
                                                className={`p-3 border rounded-lg text-sm font-medium transition-all ${mode === 'MANUAL' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                Set Paper (Manual)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMode('RANDOM')}
                                                className={`p-3 border rounded-lg text-sm font-medium transition-all ${mode === 'RANDOM' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                Random Generator
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {mode === 'MANUAL' ? (
                                        <>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-medium">Select Questions</h3>
                                                <span className="text-sm text-gray-500">{selectedQuestionIds.length} selected</span>
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
                                                {availableQuestions.map((q) => (
                                                    <div
                                                        key={q._id}
                                                        onClick={() => handleToggleQuestion(q._id)}
                                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedQuestionIds.includes(q._id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full border ${selectedQuestionIds.includes(q._id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                                                {selectedQuestionIds.includes(q._id) && <div className="w-1.5 h-1.5 bg-white rounded-full m-1" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-900">{q.text}</p>
                                                                <div className="flex gap-2 mt-1">
                                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{q.categoryId?.name}</span>
                                                                    <span className="text-xs text-gray-500">Score: {q.defaultScore}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {availableQuestions.length === 0 && <p className="text-center text-gray-500 py-4">No questions available.</p>}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-500">Random Generation UI Placeholder</p>
                                            {/* Implement random criteria selection here later */}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between">
                            {step === 1 ? (
                                <div />
                            ) : (
                                <Button variant="outline" onClick={() => setStep(1)}>Previous</Button>
                            )}
                            {step === 1 ? (
                                <Button onClick={() => setStep(2)}>Next: Select Questions</Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={isSubmitting || (mode === 'MANUAL' && selectedQuestionIds.length === 0)}>
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                    Create Quiz
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

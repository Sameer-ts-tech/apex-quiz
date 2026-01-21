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

    // Random Mode State
    const [categories, setCategories] = useState<any[]>([]);
    const [randomCriteria, setRandomCriteria] = useState<{ categoryId: string; count: number }[]>([
        { categoryId: '', count: 5 }
    ]);

    useEffect(() => {
        fetchCategories(); // Always fetch categories for valid display
        if (step === 2 && mode === 'MANUAL') {
            fetchQuestions();
        }
    }, [step, mode]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

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

    // Random Mode Handlers
    const addCriteria = () => {
        setRandomCriteria([...randomCriteria, { categoryId: '', count: 5 }]);
    };

    const removeCriteria = (index: number) => {
        const newCriteria = [...randomCriteria];
        newCriteria.splice(index, 1);
        setRandomCriteria(newCriteria);
    };

    const updateCriteria = (index: number, field: 'categoryId' | 'count', value: any) => {
        const newCriteria = [...randomCriteria];
        // @ts-ignore
        newCriteria[index][field] = value;
        setRandomCriteria(newCriteria);
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
                // Filter out incomplete criteria
                const validCriteria = randomCriteria.filter(c => c.categoryId && c.count > 0);
                if (validCriteria.length === 0) {
                    alert("Please add at least one valid criteria (Category + Count)");
                    setIsSubmitting(false);
                    return;
                }
                payload.criteria = validCriteria;
            }

            const res = await fetch('/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/coach/quizzes');
                router.refresh();
            } else {
                const errorText = await res.text();
                alert(`Error: ${errorText}`);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while creating the quiz.");
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
                        <p className="text-xs text-gray-400 mt-1">{mode === 'MANUAL' ? 'Pick specific questions' : 'Set random criteria'}</p>
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
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100 mb-4">
                                                Define rules to randomly select questions from your categories.
                                            </div>

                                            {randomCriteria.map((criteria, index) => (
                                                <div key={index} className="flex gap-4 items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                                                        <select
                                                            className="w-full rounded-md border border-gray-200 p-2 text-sm"
                                                            value={criteria.categoryId}
                                                            onChange={(e) => updateCriteria(index, 'categoryId', e.target.value)}
                                                        >
                                                            <option value="">Select Category</option>
                                                            {categories.map((c) => (
                                                                <option key={c._id} value={c._id} disabled={c.questionCount === 0}>
                                                                    {c.name} ({c.questionCount || 0} questions)
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="w-24">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Count</label>
                                                        <Input
                                                            type="number"
                                                            value={criteria.count}
                                                            onChange={(e) => updateCriteria(index, 'count', parseInt(e.target.value))}
                                                            min={1}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeCriteria(index)}
                                                        className="text-gray-400 hover:text-red-500"
                                                        disabled={randomCriteria.length === 1}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}

                                            <Button variant="outline" onClick={addCriteria} className="w-full border-dashed">
                                                <Plus className="h-4 w-4 mr-2" /> Add Selection Rule
                                            </Button>
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
                                <Button onClick={() => setStep(2)}>Next: Questions</Button>
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

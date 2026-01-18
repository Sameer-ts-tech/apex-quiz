'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Loader2, ArrowRight, CheckCircle, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { RenderMixedContent as MathRenderer } from '@/components/MathRenderer';
import Link from 'next/link';

interface Question {
    _id: string;
    text: string;
    image?: string; // Optional
    options: { _id: string; text: string; image?: string }[];
    score: number;
}

interface Quiz {
    _id: string;
    title: string;
    duration: number; // minutes
    questions: Question[];
}

export default function AttemptQuizPage() {
    const params = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({}); // valid questionId -> optionId
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(0); // in seconds

    useEffect(() => {
        if (params?.id) fetchQuiz(params.id as string);
    }, [params]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (quiz && timeLeft === 0 && !isSubmitting && !isLoading) {
            // Auto-submit logic here
             handleSubmit();
        }
    }, [timeLeft, quiz, isSubmitting, isLoading]);

    const fetchQuiz = async (id: string) => {
        try {
            const res = await fetch(`/api/quizzes/${id}`);
            if (res.ok) {
                const data = await res.json();
                setQuiz(data);
                setTimeLeft(data.duration * 60);
            } else if (res.status === 402) {
                // Payment Required
                const data = await res.json();
                // Could fetch title if available in error or just generic
                router.push(`/payment-required?title=Premium Quiz`); // Ideally pass ID to fetch details
            } else {
                // Handle 404 or error
                console.error("Failed to load quiz");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionSelect = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        if (!quiz) return;
        setIsSubmitting(true);

        // Prepare payload
        const payload = {
            quizId: quiz._id,
            answers: Object.entries(answers).map(([qId, optId]) => ({
                questionId: qId,
                selectedOptionId: optId
            }))
        };

        try {
            const res = await fetch('/api/attempts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const result = await res.json();
                router.push(`/student/attempts/${result._id}`); // Redirect to result page
            }
        } catch (error) {
            console.error("Submission failed", error);
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (!quiz) return <div className="p-10 text-center">Quiz not found</div>;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header / Timer */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm sticky top-4 z-10">
                <div>
                    <h1 className="font-bold text-gray-900">{quiz.title}</h1>
                    <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                </div>
                <div className={`flex items-center px-4 py-2 rounded-full font-mono font-medium ${timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Timer className="w-4 h-4 mr-2" />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Question Card */}
            <Card className="min-h-[400px] flex flex-col">
                <CardContent className="p-8 flex-1">
                    <div className="mb-6">
                        {currentQuestion.image && (
                            <div className="mb-4 flex justify-center">
                                <img src={currentQuestion.image} alt="Question" className="max-h-60 rounded-lg border border-gray-100 object-contain" />
                            </div>
                        )}
                        <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
                            <MathRenderer content={currentQuestion.text} />
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.options.map((opt) => {
                            const isSelected = answers[currentQuestion._id] === opt._id;
                            return (
                                <div
                                    key={opt._id}
                                    onClick={() => handleOptionSelect(currentQuestion._id, opt._id)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-4 ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
                                >
                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-blue-600' : 'border-gray-300'}`}>
                                        {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-gray-700">
                                            <MathRenderer content={opt.text} />
                                        </div>
                                        {opt.image && (
                                            <div className="mt-2">
                                                <img src={opt.image} alt="Option" className="max-h-32 rounded border border-gray-200 object-contain" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-6 flex justify-between border-t border-gray-100">
                    <Button
                        variant="outline"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    >
                        Previous
                    </Button>

                    {isLastQuestion ? (
                        <Button onClick={handleSubmit} disabled={isSubmitting} variant="primary" className="bg-green-600 hover:bg-green-700">
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Submit Quiz
                        </Button>
                    ) : (
                        <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Question Navigator */}
            <div className="flex flex-wrap gap-2 justify-center">
                {quiz.questions.map((q, idx) => {
                    const isAnswered = !!answers[q._id];
                    const isCurrent = idx === currentQuestionIndex;
                    return (
                        <button
                            key={q._id}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-8 h-8 rounded text-xs font-medium transition-colors ${isCurrent ? 'bg-blue-600 text-white' :
                                isAnswered ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

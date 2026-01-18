'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader2, ArrowLeft, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RenderMixedContent as MathRenderer } from '@/components/MathRenderer';
import Link from 'next/link';

interface Category {
    _id: string;
    name: string;
}

interface Option {
    text: string;
    image: string;
    isCorrect: boolean;
}

interface FormData {
    text: string;
    image: string;
    categoryId: string;
    defaultScore: number;
    options: Option[];
}

export default function NewQuestionPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        text: '',
        image: '',
        categoryId: '',
        defaultScore: 1,
        options: [
            { text: '', image: '', isCorrect: false },
            { text: '', image: '', isCorrect: false },
        ]
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0]._id }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionChange = (index: number, field: keyof Option, value: string | boolean) => {
        const newOptions = [...formData.options];
        newOptions[index] = { ...newOptions[index], [field]: value };

        // If setting isCorrect to true, set others to false (Single Correct)
        if (field === 'isCorrect' && value === true) {
            newOptions.forEach((opt, i) => {
                if (i !== index) opt.isCorrect = false;
            });
        }

        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { text: '', image: '', isCorrect: false }]
        });
    };

    const removeOption = (index: number) => {
        if (formData.options.length <= 2) return;
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.text || !formData.categoryId) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate that options have either text OR image
        if (formData.options.some(opt => !opt.text.trim() && !opt.image.trim())) {
            alert('All options must have either text or an image');
            return;
        }

        if (!formData.options.some(opt => opt.isCorrect)) {
            alert('Please select a correct answer');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/coach/questions');
                router.refresh();
            } else {
                alert('Failed to create question');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/coach/questions">
                    <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Create New Question</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardContent className="p-6 space-y-6">
                        {/* Question Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                {categories.length === 0 && (
                                    <p className="mt-1 text-xs text-amber-600">
                                        You need to <Link href="/coach/categories" className="underline">create a category</Link> first.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Question Text (Supports LaTeX with $...$)</label>
                                <Input
                                    placeholder="e.g. Solve for x: $x^2 + 2x + 1 = 0$"
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    required
                                />
                                {formData.text && (
                                    <div className="p-2 bg-gray-50 border rounded text-sm mt-2">
                                        <span className="text-xs text-gray-500 block mb-1">Preview:</span>
                                        <MathRenderer content={formData.text} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Question Image URL (Optional)</label>
                                <Input
                                    placeholder="http://example.com/image.png"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                                {formData.image && (
                                    <div className="mt-2">
                                        <img src={formData.image} alt="Question Preview" className="max-h-40 rounded border object-contain" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Score</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.defaultScore}
                                    onChange={(e) => setFormData({ ...formData, defaultScore: parseInt(e.target.value) })}
                                    className="w-32"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-6"></div>

                        {/* Options */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Answer Options</label>
                            <p className="text-xs text-gray-500 mb-2">Click the circle to mark the correct answer.</p>

                            {formData.options.map((option, index) => (
                                <div key={index} className="space-y-2 p-4 border rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleOptionChange(index, 'isCorrect', true)}
                                            className={`flex-shrink-0 ${option.isCorrect ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                                        >
                                            {option.isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                                        </button>
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder={`Option ${index + 1} Text`}
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                            />
                                            <Input
                                                placeholder={`Option ${index + 1} Image URL (Optional)`}
                                                value={option.image}
                                                onChange={(e) => handleOptionChange(index, 'image', e.target.value)}
                                            />
                                        </div>
                                        {formData.options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                className="text-gray-400 hover:text-red-500 self-start mt-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Preview Area for Option */}
                                    {(option.text || option.image) && (
                                        <div className="ml-9 border-t border-gray-200 pt-2 flex gap-4 items-center">
                                            {option.text && (
                                                <div className="text-sm">
                                                    <MathRenderer content={option.text} />
                                                </div>
                                            )}
                                            {option.image && (
                                                <img src={option.image} alt="Option Preview" className="h-12 rounded border object-contain" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Button type="button" variant="ghost" size="sm" onClick={addOption} className="mt-2 text-blue-600">
                                <Plus className="h-4 w-4 mr-2" /> Add Option
                            </Button>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Question'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}

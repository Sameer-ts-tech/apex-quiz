'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
    _id: string;
    name: string;
    createdAt: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCategoryName }),
            });

            if (res.ok) {
                setNewCategoryName('');
                fetchCategories();
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create category', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Category Management</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Create Category Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex gap-4">
                            <Input
                                placeholder="e.g. Physics, Mathematics"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <Button type="submit" disabled={isSubmitting || !newCategoryName.trim()}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                <span className="ml-2">Add</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Category List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                            </div>
                        ) : categories.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No categories found. Create one to get started.</p>
                        ) : (
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    <li key={category._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                                        <span className="font-medium text-gray-700">{category.name}</span>
                                        {/* Add delete functionality later if needed */}
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

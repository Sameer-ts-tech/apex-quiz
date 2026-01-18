'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, Loader2, BookOpen, Clock, PlayCircle } from 'lucide-react';
import Link from 'next/link';

interface Quiz {
    _id: string;
    title: string;
    description: string;
    createdBy: { name: string };
    duration: number;
    isPaid: boolean;
    questions: any[];
}

export default function MarketplacePage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const loadQuizzes = useCallback(async (pageNum: number, searchTerm: string, reset = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/student/marketplace?page=${pageNum}&limit=9&search=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();

            setQuizzes(prev => reset ? data.quizzes : [...prev, ...data.quizzes]);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Error loading quizzes:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load and search changes
    useEffect(() => {
        setPage(1);
        loadQuizzes(1, search, true);
    }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

    // Load more when page changes
    useEffect(() => {
        if (page > 1) {
            loadQuizzes(page, search, false);
        }
    }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

    // Infinite scroll observer
    const lastQuizElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quiz Marketplace</h1>
                    <p className="text-gray-500 mt-1">Explore quizzes from top coaches</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search quizzes..."
                        className="pl-10"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz, index) => {
                    const isLast = index === quizzes.length - 1;
                    return (
                        <Card
                            key={quiz._id}
                            ref={isLast ? lastQuizElementRef : null}
                            className="flex flex-col h-full hover:shadow-lg transition-shadow border-gray-200"
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={quiz.isPaid ? "default" : "secondary"} className={quiz.isPaid ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : "bg-green-100 text-green-800 hover:bg-green-100"}>
                                        {quiz.isPaid ? 'PAID' : 'FREE'}
                                    </Badge>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {quiz.duration} mins
                                    </div>
                                </div>
                                <CardTitle className="line-clamp-2 min-h-[3.5rem]">{quiz.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                                    {quiz.description || 'No description provided.'}
                                </p>
                                <div className="flex items-center text-sm text-gray-600">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 text-xs font-bold">
                                        {quiz.createdBy?.name?.[0] || 'C'}
                                    </div>
                                    <span className="truncate">By {quiz.createdBy?.name || 'Unknown Coach'}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Link href={`/student/quizzes/${quiz._id}`} className="w-full">
                                    <Button className="w-full group">
                                        Start Quiz
                                        <PlayCircle className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {loading && (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            )}

            {!loading && quizzes.length === 0 && (
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No quizzes found</h3>
                    <p className="text-gray-500">Try adjusting your search terms.</p>
                </div>
            )}

            {!loading && !hasMore && quizzes.length > 0 && (
                <div className="text-center py-6 border-t border-gray-100 mt-8">
                    <p className="text-sm text-gray-400">You've reached the end of the list</p>
                </div>
            )}
        </div>
    );
}

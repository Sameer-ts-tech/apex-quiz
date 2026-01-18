'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { LayoutDashboard, GraduationCap, School } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/'); // Middleware or client-side check will redirect to dashboard
                router.refresh();
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Apex Quiz</h1>
                    <p className="text-gray-500 mt-2">Sign in to your account</p>
                </div>

                <Card className="border-0 shadow-xl ring-1 ring-gray-900/5">
                    <CardHeader>
                        <CardTitle className="text-center">Welcome Back</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100 flex items-center">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Register
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

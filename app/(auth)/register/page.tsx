'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { UserRole } from '@/types/roles';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'COACH', // Default to Coach
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Apex Quiz</h1>
                    <p className="text-gray-500 mt-2">Create your account</p>
                </div>

                <Card className="border-0 shadow-xl ring-1 ring-gray-900/5">
                    <CardHeader>
                        <CardTitle className="text-center">Register</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Phone Number"
                                type="tel"
                                placeholder="1234567890"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'COACH' })}
                                        className={`p-3 border rounded-lg text-sm font-medium transition-all ${formData.role === 'COACH'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        Coach
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                                        className={`p-3 border rounded-lg text-sm font-medium transition-all ${formData.role === 'STUDENT'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        Student
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                                Create Account
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

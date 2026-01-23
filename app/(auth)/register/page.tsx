'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { GraduationCap, User, Mail, Phone, Lock, ArrowRight, UserCircle, Briefcase } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden py-12">
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                        Apex Quiz
                    </h1>
                    <p className="text-gray-400 mt-2">Create your account</p>
                </div>

                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-white">Join the Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <Input
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="pl-10 bg-slate-950/50 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <Input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="pl-10 bg-slate-950/50 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <Input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="pl-10 bg-slate-950/50 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="pl-10 bg-slate-950/50 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 ml-1">I am a...</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'COACH' })}
                                        className={`flex items-center justify-center p-3 border rounded-xl text-sm font-medium transition-all duration-300 ${formData.role === 'COACH'
                                            ? 'border-blue-500 bg-blue-500/20 text-blue-400 ring-1 ring-blue-500'
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <Briefcase className="h-4 w-4 mr-2" />
                                        Coach
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                                        className={`flex items-center justify-center p-3 border rounded-xl text-sm font-medium transition-all duration-300 ${formData.role === 'STUDENT'
                                            ? 'border-blue-500 bg-blue-500/20 text-blue-400 ring-1 ring-blue-500'
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Student
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-400 bg-red-400/10 rounded-xl border border-red-500/20 flex items-center animate-in fade-in slide-in-from-top-1">
                                    <span className="mr-2">⚠️</span>
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 py-6 text-lg shadow-lg shadow-blue-500/25 transition-all duration-300 active:scale-[0.98]"
                                isLoading={isLoading}
                            >
                                Create Account
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-white/5 pt-6 bg-white/5 rounded-b-xl">
                        <p className="text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

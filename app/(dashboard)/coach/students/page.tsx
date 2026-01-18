'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { User, Mail, Calendar, Plus, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Student {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

export default function StudentsPage() {
    const { data: session } = useSession();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phoneNumber: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/coach/students');
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (err) {
            console.error('Failed to fetch students', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateStudent = async (e: React.FormEvent) => { // Renamed handleSubmit to handleCreateStudent
        e.preventDefault();
        setIsCreating(true);
        setError(''); // Removed setError from here, but keeping the state for other potential uses

        try {
            const res = await fetch('/api/coach/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            // const data = await res.json(); // Removed this line as per instruction

            if (res.ok) { // Modified logic for handling response
                setFormData({ name: '', email: '', password: '', phoneNumber: '' }); // Updated formData reset
                setShowForm(false);
                fetchStudents();
            } else {
                const data = await res.json(); // Re-added to get error message if not ok
                setError(data.message || 'Failed to create student'); // Set error message
            }
        } catch (err: any) {
            console.error(err); // Changed to console.error
            setError('An unexpected error occurred.'); // Generic error message
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">Student Management</h1>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Student
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="max-w-md w-full border-blue-100 shadow-xl bg-white relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => setShowForm(false)}
                        >
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </Button>
                        <CardHeader>
                            <CardTitle>Register New Student</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateStudent} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder="Phone Number"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <div className="flex gap-2 justify-end mt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                                    <Button type="submit" isLoading={isCreating}>
                                        Create Account
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {students.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-100">
                            <p className="text-gray-500">No students enrolled yet.</p>
                        </div>
                    ) : (
                        students.map((student) => (
                            <Card key={student._id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{student.name}</CardTitle>
                                            <p className="text-xs text-gray-500">ID: {student._id.slice(-6)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/coach/students/${student._id}`}>
                                                <Button variant="outline" size="sm">
                                                    View Results
                                                </Button>
                                            </Link>
                                            {/* Add Edit/Delete buttons here if needed */}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                        {student.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        Joined: {new Date(student.createdAt).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

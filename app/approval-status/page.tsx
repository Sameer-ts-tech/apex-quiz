'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2, AlertTriangle, UserX, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ApprovalStatusPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // If approved or wrong role, redirect away
        if (status === 'authenticated') {
            if (session?.user?.role !== 'COACH') {
                router.push('/');
            } else if (session?.user?.status === 'APPROVED') {
                router.push('/coach'); // Go to dashboard if approved
            }
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
    }

    const accountStatus = session?.user?.status || 'PENDING';
    const rejectionReason = (session?.user as any)?.rejectionReason || 'No reason provided.'; 
    // Ideally we put rejectionReason in session, but let's stick to simple status for now.

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Apex Quiz</h1>
                    <p className="text-gray-500 mt-2">Coaching Partner Program</p>
                </div>

                <Card className="border-t-4 border-t-yellow-500 shadow-lg">
                    <CardContent className="pt-6 pb-6 text-center">
                        {accountStatus === 'PENDING' ? (
                            <div className="space-y-4">
                                <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Account Under Review</h2>
                                <p className="text-gray-600">
                                    Thank you for registering. Your account is currently pending approval from the Super Admin.
                                </p>
                                <p className="text-sm text-gray-500">
                                    You will be able to access your dashboard once approved. Please check back later.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <UserX className="h-6 w-6 text-red-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
                                <p className="text-gray-600">
                                    Your account application has been rejected.
                                </p>

                                {/* rejection reason */}

                                 <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
                                    Reason: {rejectionReason}
                                </p> 
                                <p className="text-sm text-gray-500">
                                    Please contact support for more information.
                                </p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <Button variant="outline" onClick={() => signOut({ callbackUrl: '/login' })} className="w-full">
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

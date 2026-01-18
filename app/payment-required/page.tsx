'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const quizTitle = searchParams.get('title') || 'Premium Quiz';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Card className="max-w-md w-full border-yellow-200 shadow-xl bg-white text-center">
                <CardHeader className="space-y-4 pb-2">
                    <div className="mx-auto bg-yellow-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
                        <Lock className="h-10 w-10 text-yellow-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        {quizTitle} is Locked
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-600">
                        This is a Premium Quiz. To access this content, you need to purchase it or upgrade your plan.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Payment Integration Needed</p>
                        <p className="text-xs text-gray-500">
                            (The user will create payment integration later. This is a placeholder for the checkout flow.)
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                            Unlock Now
                        </Button>
                        <Link href="/student/marketplace" className="w-full">
                            <Button variant="outline" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Marketplace
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentRequiredPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}

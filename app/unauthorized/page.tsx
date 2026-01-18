import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-8 max-w-md">
                You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
            </p>
            <div className="space-x-4">
                <Link href="/">
                    <Button variant="outline">Go Home</Button>
                </Link>
                <Link href="/login">
                    <Button variant="primary">Login with different account</Button>
                </Link>
            </div>
        </div>
    );
}

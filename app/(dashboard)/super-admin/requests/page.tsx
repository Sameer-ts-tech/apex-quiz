'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader2, CheckCircle, XCircle, User, Mail, Calendar } from 'lucide-react';

interface Request {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    status: string;
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/requests');
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        setProcessingId(id);
        let rejectionReason = '';

        if (status === 'REJECTED') {
            const reason = prompt("Enter rejection reason:");
            if (!reason) {
                setProcessingId(null);
                return; // Cancelled
            }
            rejectionReason = reason;
        }

        try {
            const res = await fetch('/api/admin/requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id, status, rejectionReason }),
            });

            if (res.ok) {
                // Remove from list
                setRequests(requests.filter(r => r._id !== id));
            }
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">Access Requests</h1>

            {requests.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                        No pending requests at the moment.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {requests.map((req) => (
                        <Card key={req._id}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{req.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                                        <span className="flex items-center"><Mail className="h-4 w-4 mr-1" /> {req.email}</span>
                                        <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleAction(req._id, 'APPROVED')}
                                        isLoading={processingId === req._id}
                                        disabled={!!processingId}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleAction(req._id, 'REJECTED')}
                                        isLoading={processingId === req._id}
                                        disabled={!!processingId}
                                    >
                                        <XCircle className="h-4 w-4 mr-1" /> Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

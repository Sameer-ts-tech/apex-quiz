'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const [revenueShare, setRevenueShare] = useState('90');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/system-config');
            if (res.ok) {
                const data = await res.json();
                const shareConfig = data.find((c: any) => c.key === 'REVENUE_SHARE_PERCENTAGE');
                if (shareConfig) setRevenueShare(shareConfig.value);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/system-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'REVENUE_SHARE_PERCENTAGE',
                    value: revenueShare
                })
            });

            if (res.ok) {
                alert('Settings saved successfully');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to save settings', error);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black">System Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Revenue Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teacher Revenue Share Percentage (%)
                        </label>
                        <div className="flex items-center gap-4 max-w-xs">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={revenueShare}
                                onChange={(e) => setRevenueShare(e.target.value)}
                            />
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                <span className="ml-2">Save</span>
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            This percentage defines the revenue split for coaching centers based on question usage.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

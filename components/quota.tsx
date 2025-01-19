"use client"

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Coins } from "lucide-react";

interface QuotaData {
    quota: number;
}

export default function Quota() {
    const { data: session } = useSession();
    const [quota, setQuota] = useState<QuotaData | null>(null);

    useEffect(() => {
        async function fetchQuota() {
            if (session?.user?.id) {
                try {
                    const response = await fetch('/api/user/quota', {
                        method: 'GET',
                        headers: {
                            'user_id': session.user.id
                        }
                    });
                    if (!response.ok) throw new Error('Failed to fetch quota');
                    const data = await response.json();
                    setQuota(data);
                } catch (error) {
                    console.error('Error fetching quota:', error);
                }
            }
        }
        fetchQuota();
    }, [session?.user?.id]);

    return (
        <div className="max-w-3xl mx-auto w-full px-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Coins className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Available Credits</h3>
                            <p className="text-xs text-gray-500">Remaining balance for AI interactions</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-semibold text-blue-600">
                            ${(quota?.quota || 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}



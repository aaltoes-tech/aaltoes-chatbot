"use client"

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Zap } from "@geist-ui/icons";
import { Button } from "./ui/button";

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
        <div className="max-w-3xl mx-auto w-full mb-6 t-10 py-6">
            <div className="bg-card rounded-xl shadow-sm border p-4 border-border">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-foreground">Available Credits</h3>
                                <p className="text-xs text-muted-foreground">Remaining balance for AI interactions</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-semibold text-primary">
                                ${(quota?.quota || 0).toFixed(5)}
                            </span>
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        className="w-full hover:bg-accent hover:text-accent-foreground"
                        onClick={() => window.location.href = "mailto:admin@aaltoes.com?subject=Aaltoes%20ChatBot:%20Quota%20Request"}
                    >
                        Request More Credits
                    </Button>
                </div>
            </div>
        </div>
    );
}



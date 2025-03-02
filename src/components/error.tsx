'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';

interface ErrorProps {
    title: string;
    message: string;
    code: number;
}

export function ErrorPage({ title, message, code }: ErrorProps) {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-6">
            <Card className="max-w-lg w-full text-center border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-none bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl">
                <CardHeader>
                    <h1 className="text-3xl font-bold text-red-600">{title}</h1>
                    <CardDescription className="text-gray-800 dark:text-gray-300 mt-2">{message}</CardDescription>
                </CardHeader>
                <div className="mt-4 text-gray-500 text-sm">Error Code: {code}</div>
                <CardFooter className="mt-6">
                    <Button variant="outline" onClick={handleGoBack} className="w-full">
                        Go Back
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import {useTranslations} from 'next-intl';

// Fehlermeldungen basierend auf dem Fehlercode
const errorMessages: Record<number, { title: string; message: string }> = {
    400: {
        title: 'errorMessages.400.title',
        message: 'errorMessages.400.message',
    },
    401: {
        title: 'errorMessages.401.title',
        message: 'errorMessages.401.message',
    },
    403: {
        title: 'errorMessages.403.title',
        message: 'errorMessages.403.message',
    },
    404: {
        title: 'errorMessages.404.title',
        message: 'errorMessages.404.message',
    },
    500: {
        title: 'errorMessages.500.title',
        message: 'errorMessages.500.message',
    },
};

// Standardwerte für unbekannte Fehlercodes
const defaultError = {
    title: 'errorMessages.defaultError.title',
    message: 'errorMessages.defaultError.message',
};

export function ErrorPage() {
    const t = useTranslations('errors');

    const searchParams = useSearchParams();
    const router = useRouter();

    // Fehlercode aus der URL holen und sicherstellen, dass es eine Zahl ist
    const code = parseInt(searchParams.get('code') || '500', 10);
    const { title, message } = errorMessages[code] || defaultError;

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-6">
            <Card className="max-w-lg w-full text-center border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-none bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl">
                <CardHeader>
                    <h1 className="text-3xl font-bold text-red-600">{t(title)}</h1>
                    <CardDescription className="text-gray-800 dark:text-gray-300 mt-2">{t(message)}</CardDescription>
                </CardHeader>
                <div className="mt-4 text-gray-500 text-sm">Error Code: {code}</div>
                <CardFooter className="mt-6">
                    <Button variant="outline" onClick={handleGoBack} className="w-full">
                        {t('goBackButton')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

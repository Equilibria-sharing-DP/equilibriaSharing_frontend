'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

// Fehlermeldungen basierend auf dem Fehlercode
const errorMessages: Record<number, { title: string; message: string }> = {
    400: {
        title: 'Ungültige Anfrage',
        message: 'Die angeforderte Seite kann nicht verarbeitet werden, da erforderliche Daten fehlen.',
    },
    401: {
        title: 'Nicht autorisiert',
        message: 'Sie haben keine Berechtigung, diese Seite zu sehen.',
    },
    403: {
        title: 'Zugriff verweigert',
        message: 'Sie haben keinen Zugriff auf diese Ressource.',
    },
    404: {
        title: 'Seite nicht gefunden',
        message: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
    },
    500: {
        title: 'Serverfehler',
        message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    },
};

// Standardwerte für unbekannte Fehlercodes
const defaultError = {
    title: 'Unbekannter Fehler',
    message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
};

export function ErrorPage() {
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

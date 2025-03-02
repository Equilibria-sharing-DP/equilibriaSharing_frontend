"use client";
import {ReactElement, useEffect, useState} from 'react';
import {ErrorPage} from '@/components/error';

export default function ErrorPageWrapper(): ReactElement {
    const [errorData, setErrorData] = useState({
        title: 'Something went wrong',
        message: 'An unexpected error occurred.',
        code: 500,
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const title = urlParams.get('title');
        const message = urlParams.get('message');
        const code = urlParams.get('code');

        if (title && message && code) {
            setErrorData({
                title,
                message,
                code: parseInt(code),
            });
        }
    }, []);

    return <ErrorPage {...errorData} />;
};

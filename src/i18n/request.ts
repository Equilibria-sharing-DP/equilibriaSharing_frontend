import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
    const defaultLocale = 'en';
    const cookieLocale = headers().get('cookie')?.match(/locale=([^;]+)/)?.[1];
    const locale = cookieLocale || defaultLocale;

    const messages = (await import(`../../messages/${locale}.json`)).default;
    
    return {
        locale,
        messages,
    };
});
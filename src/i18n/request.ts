import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
    const headersList = headers();
    const acceptLanguage = headersList.get('accept-language');
    const referer = headersList.get('referer'); // Extract the referer header to get the URL
    const defaultLocale = 'en';

    let localeFromParams = null;
    if (referer) {
        try {
            const url = new URL(referer);
            localeFromParams = url.searchParams.get('locale');
        } catch {
            console.error("Invalid referer URL");
        }
    }

    // Fallback to the `accept-language` header or default locale
    const localeFromHeader = acceptLanguage?.split(',')[0]?.split('-')[0];
    const locale = localeFromParams || localeFromHeader || defaultLocale;

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
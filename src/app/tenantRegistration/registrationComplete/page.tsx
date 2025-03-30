import Image from "next/image";
import {useTranslations} from 'next-intl';

export default function RegistrationSuccessPage() {
    const t = useTranslations('registrationSuccess');
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 md:mb-8">
                <Image
                    src="/img/logo.webp"
                    alt="Equilibria Sharing"
                    width={320}
                    height={320}
                    priority
                    className="mx-auto w-48 md:w-64 lg:w-80"
                />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">{t('title')}</h1>
            <p className="text-gray-600 text-sm md:text-base max-w-md">
                {t('message')}
            </p>
        </div>
    );
}
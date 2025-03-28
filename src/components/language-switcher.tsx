"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const LanguageSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentLocale = searchParams.get("locale") || "en"; // Default to "en"
    const locales = ["en", "de"]; // Define supported locales

    const changeLanguage = (newLocale: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("locale", newLocale);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center space-x-2">
            {locales.map((lng) => (
                <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className={`px-2 py-1 text-sm ${
                        lng === currentLocale ? "font-bold underline" : ""
                    }`}
                >
                    {lng.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

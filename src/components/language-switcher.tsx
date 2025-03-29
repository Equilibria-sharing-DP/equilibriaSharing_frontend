"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleFlag } from "react-circle-flags";

const languageFlags: Record<string, string> = {
    en: "gb", // English flag (ISO Alpha-2 code)
    de: "de", // German flag (ISO Alpha-2 code)
};

export const LanguageSwitcher = ({ initialLocale }: { initialLocale: string }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locales = Object.keys(languageFlags);

    const [currentLocale, setCurrentLocale] = useState(initialLocale || "en");

    const changeLanguage = (locale: string) => {
        localStorage.setItem("locale", locale); // Save locale to localStorage
        document.cookie = `locale=${locale}; path=/`; // Save locale to cookies

        const params = new URLSearchParams(searchParams.toString());
        params.set("locale", locale); // Update the locale in the query parameters

        setCurrentLocale(locale);
        router.replace(`${pathname}?${params.toString()}`); // Preserve the path and query parameters
    };

    useEffect(() => {
        const storedLocale = localStorage.getItem("locale") || document.cookie.match(/locale=([^;]+)/)?.[1];
        if (storedLocale && storedLocale !== currentLocale) {
            setCurrentLocale(storedLocale);
        }
    }, [currentLocale]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 ml-4">
                    <div className="inline-flex items-center gap-2">
                        <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                            <CircleFlag countryCode={languageFlags[currentLocale] || "gb"} height={20} />
                        </div>
                        {(currentLocale || "en").toUpperCase()}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {locales.map((lng) => (
                    <DropdownMenuItem key={lng} onClick={() => changeLanguage(lng)}>
                        <div className="inline-flex items-center gap-2">
                            <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                                <CircleFlag countryCode={languageFlags[lng]} height={20} />
                            </div>
                            {lng.toUpperCase()}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

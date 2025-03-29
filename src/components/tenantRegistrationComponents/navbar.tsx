"use client";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export const Navbar = ({ initialLocale }: { initialLocale: string }) => {
    return (
        <div className="max-w-screen-xl gap-4 mx-auto ">
            <nav className="container relative flex items-center justify-between p-4 mx-auto lg:justify-between">
                <Link href="/" className="flex items-center space-x-2 text-xl font-medium">
                    <span>Equilibira Sharing - Mieterdaten Erfassung</span>
                </Link>

                <div className="flex items-center px-4 space-x-4">
                    <LanguageSwitcher initialLocale={initialLocale} />
                    <ModeToggle />
                </div>
            </nav>
        </div>
    );
};

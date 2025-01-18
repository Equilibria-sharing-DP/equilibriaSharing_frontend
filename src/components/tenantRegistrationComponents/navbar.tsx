"use client";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ModeToggle} from "@/components/mode-toggle";

export const Navbar = () => {
    const navigation = [
        {name: "Beispiel", href: "/#"}, // Passen Sie den Link hier an
    ];

    return (
        <div className="max-w-screen-xl gap-4 mx-auto border-b border-gray-10">
            <nav className="container relative flex items-center justify-between p-4 mx-auto lg:justify-between">
                <Link href="/" className="flex items-center space-x-2 text-xl font-medium">
                    <span>Equilibira Sharing - Mieterdaten Erfassung</span>
                </Link>

                <div className="hidden lg:flex lg:items-center">
                    <ul className="flex items-center space-x-4">
                        {navigation.map((menu, index) => (
                            <li key={index}>
                                <Button asChild variant="link">
                                    <Link href={menu.href}>{menu.name}</Link>
                                </Button>
                            </li>
                        ))}
                        <ModeToggle/>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

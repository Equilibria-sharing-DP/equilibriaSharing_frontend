"use client";
import Link from "next/link";
import {ModeToggle} from "@/components/mode-toggle";

export const Navbar = () => {

    return (
        <div className="max-w-screen-xl gap-4 mx-auto ">
            <nav className="container relative flex items-center justify-between p-4 mx-auto lg:justify-between">
                <Link href="/" className="flex items-center space-x-2 text-xl font-medium">
                    <span>Equilibira Sharing</span>
                </Link>

                <div className="hidden lg:flex lg:items-center">

                        <ModeToggle/>
                </div>
            </nav>
        </div>
    );
};

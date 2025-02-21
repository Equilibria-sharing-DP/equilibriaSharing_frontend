"use client";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {UserDropdown} from "@/components/tenantDataManagementComponents/user-dropdown";

export const Navbar = () => {
    const navigation = [
        { name: "Immobilien Ansicht", href: "/tenantDataManagement/properties" },
        { name: "Österreich Immobilien", href: "/tenantDataManagement/properties?country=austria" },
        { name: "Italien Immobilien", href: "/tenantDataManagement/properties?country=italy" },
    ];

    return (
        <div className="max-w-screen-xl gap-4 mx-auto">
            <nav className="container relative flex items-center justify-between p-4 mx-auto lg:justify-between">
                <Link href="/" className="flex items-center space-x-2 text-xl font-medium">
                    <span>Equilibira Sharing - Mieterdaten Management</span>
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
                        <UserDropdown/>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

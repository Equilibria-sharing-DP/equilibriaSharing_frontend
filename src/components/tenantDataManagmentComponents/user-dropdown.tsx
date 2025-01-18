"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ModeDropdown} from "@/components/mode-dropdown";
import {LogOut} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useTheme} from "next-themes";

export function UserDropdown() {
    const {theme} = useTheme();

    return (
        <DropdownMenu key={theme}>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage src="#" alt="User Name"/>
                    <AvatarFallback>UN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <ModeDropdown/>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>Abmelden</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

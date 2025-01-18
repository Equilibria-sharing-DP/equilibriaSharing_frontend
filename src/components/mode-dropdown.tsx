"use client"

import * as React from "react"
import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"

export function ModeDropdown() {
    const {setTheme} = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
                <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2 h-4 w-4"/>
                <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2 h-4 w-4"/>
                <span>Light/Dark Mode</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    error?: boolean;
    disable?: boolean;
}

export function DatePicker({ date, setDate, error, disable }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full max-w-md justify-start text-left font-normal", // größere max-w-Klasse für breitere Buttons
                        !date && "text-muted-foreground",
                        error
                        ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900 focus-visible:ring-red-500 dark:focus-visible:ring-red-400" // Fehler-Styles
                        : "border-input focus-visible:ring-ring"
                    )}

                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={disable}
                />
            </PopoverContent>
        </Popover>
    );
}

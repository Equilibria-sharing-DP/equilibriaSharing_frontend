import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DatePickerYearProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    error?: boolean // Optional error prop
    placeholder?: string // Optional placeholder prop
}

export function DatePickerYear({ date, setDate, error, placeholder = "Datum auswählen" }: DatePickerYearProps) {
    const [month, setMonth] = React.useState<number>(date instanceof Date ? date.getMonth() : new Date().getMonth())
    const [year, setYear] = React.useState<number>(date instanceof Date ? date.getFullYear() : new Date().getFullYear())

    const handleYearChange = (value: string) => {
        const newYear = parseInt(value, 10)
        setYear(newYear)
        if (date) {
            setDate(new Date(newYear, month, date.getDate()))
        }
    }

    const handleMonthChange = (value: string) => {
        const newMonth = parseInt(value, 10)
        setMonth(newMonth)
        if (date) {
            setDate(new Date(year, newMonth, date.getDate()))
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full max-w-md justify-start text-left font-normal", // größere max-w-Klasse für breitere Buttons
                        !date && "text-muted-foreground",
                        error
                            ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900 focus-visible:ring-red-500 dark:focus-visible:ring-red-400" // Fehler-Styles
                            : "border-input focus-visible:ring-ring"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date instanceof Date && !isNaN(date.getTime()) ? format(date, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="flex justify-between p-2">
                    <Select onValueChange={handleMonthChange} value={month.toString()}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Monat" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                    {format(new Date(2000, i, 1), "MMMM")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={handleYearChange} value={year.toString()}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Jahr" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 201 }, (_, i) => (
                                <SelectItem key={i} value={(1900 + i).toString()}>
                                    {1900 + i}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Calendar
                    mode="single"
                    selected={date || new Date()} // Fallback to the current date if date is undefined
                    onSelect={setDate}
                    month={new Date(year || new Date().getFullYear(), month)} // Fallback to the current year if year is undefined
                    onMonthChange={(newMonth) => {
                        setMonth(newMonth.getMonth())
                        setYear(newMonth.getFullYear())
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

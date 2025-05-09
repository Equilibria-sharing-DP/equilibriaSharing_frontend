"use client";
import React, { useCallback, useState, forwardRef, useEffect } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckIcon, Globe } from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import { countries } from "country-data-list";

interface Country {
    alpha2: string;
    alpha3: string;
    name: string;
}

interface CountryDropdownProps {
    options?: Country[];
    onChange?: (countryCode: string) => void;
    value?: string;
    disabled?: boolean;
    placeholder?: string;
    slim?: boolean;
    error?: boolean; // Fehler-Prop hinzufügen
}

const CountryDropdownComponent = (
    {
        options = countries.all.filter(
            (country: Country) => country.alpha2 && country.alpha3 && country.name
        ),
        onChange,
        value,
        disabled = false,
        placeholder = "Select a country",
        slim = false,
        error = false, // Fehlerzustand in der Komponente verwenden
        ...props
    }: CountryDropdownProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) => {
    const [open, setOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
        undefined
    );

    useEffect(() => {
        if (value) {
            const country = options.find(c => c.alpha3 === value);
            setSelectedCountry(country);
        } else {
            setSelectedCountry(undefined);
        }
    }, [value, options]);

    const handleSelect = useCallback(
        (country: Country) => {
            setSelectedCountry(country);
            onChange?.(country.alpha3);
            setOpen(false);
        },
        [onChange]
    );

    const triggerClasses = cn(
        "flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        slim === true && "w-20",
        error
            ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900 focus-visible:ring-red-500 dark:focus-visible:ring-red-400" // Fehler-Styles
            : "border-input focus-visible:ring-ring"
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                ref={ref}
                className={triggerClasses}
                disabled={disabled}
                {...props}
            >
                {selectedCountry ? (
                    <div className="flex items-center flex-grow w-0 gap-2 overflow-hidden">
                        <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                            <CircleFlag
                                countryCode={selectedCountry.alpha2.toLowerCase()}
                                height={20}
                            />
                        </div>
                        {!slim && (
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {selectedCountry.name}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className={!selectedCountry && "text-muted-foreground"}>
                        {!slim ? placeholder : <Globe size={20} />}
                    </span>
                )}
                <ChevronDown size={16} />
            </PopoverTrigger>
            <PopoverContent
                collisionPadding={10}
                side="bottom"
                className="min-w-[--radix-popper-anchor-width] p-0"
            >
                <Command className="w-full max-h-[200px] sm:max-h-[270px]">
                    <CommandList>
                        <div className="sticky top-0 z-10 bg-popover">
                            <CommandInput placeholder="Search country..." />
                        </div>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option, key: number) => (
                                <CommandItem
                                    className="flex items-center w-full gap-2"
                                    key={key}
                                    onSelect={() => handleSelect(option)}
                                >
                                    <div className="flex flex-grow w-0 space-x-2 overflow-hidden">
                                        <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                                            <CircleFlag
                                                countryCode={option.alpha2.toLowerCase()}
                                                height={20}
                                            />
                                        </div>
                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                            {option.name}
                                        </span>
                                    </div>
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4 shrink-0",
                                            option.alpha3 === selectedCountry?.alpha3
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

export const CountryDropdown = forwardRef(CountryDropdownComponent);

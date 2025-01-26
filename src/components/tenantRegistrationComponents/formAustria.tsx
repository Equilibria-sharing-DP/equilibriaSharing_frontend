"use client";
import React, { useState } from "react";
import {useFieldArray, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePickerYear } from "@/components/date-picker-year";
import { DatePicker } from "@/components/date-picker";
import { CountryDropdown } from "@/components/country-dropdown-menu";
import { Progress } from "@/components/ui/progress";

const genderOptions = [
    { value: "männlich", label: "Männlich" },
    { value: "weiblich", label: "Weiblich" },
    { value: "divers", label: "Divers" },
];

const documentTypes = [
    { value: "reisepass", label: "Reisepass" },
    { value: "personalausweis", label: "Personalausweis" },
];

const formSchema = z.object({
    familienname: z.string().min(1, "Familienname ist erforderlich"),
    vorname: z.string().min(1, "Vorname ist erforderlich"),
    geschlecht: z.enum(["männlich", "weiblich", "divers"]),
    geburtsdatum: z.date(),
    adresse: z.object({
        city: z.string().min(1, { message: "Die Stadt ist erforderlich." }),
        postalCode: z.number().positive({
            message: "Die Postleitzahl muss positiv sein.",
        }),
        street: z.string().min(1, { message: "Die Straße ist erforderlich." }),
        houseNumber: z.number().positive({
            message: "Die Hausnummer muss positiv sein.",
        }),
        addressAdditional: z.string().optional(),
        staat: z.string().min(1, { message: "Der Staat ist erforderlich." }),
    }),
    reisedokument: z.object({
        typ: z.enum(["reisepass", "personalausweis"]),
        ausstellungsdatum: z.date(),
        ausstellendeBehörde: z.string().min(1, "Ausstellende Behörde ist erforderlich"),
        staat: z.string().min(1, "Staat ist erforderlich"),
    }),
    ankunftsdatum: z.date(),
    abreisedatum: z.date(),
    mitreisende: z.array(
        z.object({
            familienname: z.string().nonempty("Familienname erforderlich"),
            vorname: z.string().nonempty("Vorname erforderlich"),
            geburtsdatum: z.date({ required_error: "Geburtsdatum erforderlich" }),
        })
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function FormAustria() {

    const [currentPage, setCurrentPage] = useState(0);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mitreisende: [],
        },
    });

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: 'mitreisende',
    });

    const onSubmit = (data: FormValues) => {
        console.log(data);
    };

    const pages = [
        <div key="page1">
            <h3 className="text-lg font-semibold">Persönliche Daten</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="familienname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Familienname</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="vorname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Vorname</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="geschlecht"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Geschlecht</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Geschlecht auswählen"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {genderOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="geburtsdatum"
                    render={({field}) => (
                        <FormItem className="flex-1">
                            <FormLabel>Geburtsdatum</FormLabel>
                            <DatePickerYear
                                date={field.value}
                                setDate={field.onChange}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>,
        <div key="page2">
            <h3 className="text-lg font-semibold">Adresse</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="adresse.city"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Stadt</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="adresse.postalCode"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Postleitzahl</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="adresse.street"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Straße</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="adresse.houseNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Hausnummer</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="adresse.addressAdditional"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Adresszusatz</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="adresse.staat"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Staatsangehörigkeit</FormLabel>
                            <FormControl>
                                <CountryDropdown
                                    placeholder="Land auswählen"
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>,
        <div key="page3">
            <h3 className="text-lg font-semibold">Reisedokument</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="reisedokument.typ"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Dokumenttyp</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Dokumenttyp auswählen"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {documentTypes.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reisedokument.ausstellungsdatum"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Ausstellungsdatum</FormLabel>
                            <DatePickerYear
                                date={field.value}
                                setDate={field.onChange}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reisedokument.ausstellendeBehörde"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Ausstellende Behörde</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reisedokument.staat"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Ausstellender Staat</FormLabel>
                            <CountryDropdown
                                placeholder="Land auswählen"
                                onChange={field.onChange}
                                value={field.value}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>,
        <div key="page4">
            <h3 className="text-lg font-semibold">Reisedaten</h3>
            <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="ankunftsdatum"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Ankunftsdatum</FormLabel>
                                <DatePicker
                                    date={field.value}
                                    setDate={field.onChange}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="abreisedatum"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Voraussichtliches Abreisedatum</FormLabel>
                                <DatePicker
                                    date={field.value}
                                    setDate={field.onChange}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            ,
            <div key="page5">
                <div>
                    <h3 className="text-lg font-semibold">Mitreisende</h3>
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4">
                            <FormField
                                control={form.control}
                                name={`mitreisende.${index}.familienname`}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Familienname</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`mitreisende.${index}.vorname`}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Vorname</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`mitreisende.${index}.geburtsdatum`}
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Geburtsdatum</FormLabel>
                                    <DatePickerYear
                                        date={field.value}
                                        setDate={field.onChange}
                                    />
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                        >
                            Mitreisenden entfernen
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({familienname: '', vorname: '', geburtsdatum: new Date()})}
                >
                    Mitreisenden hinzufügen
                </Button>
            </div>
        </div>
    ];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Progress
                    value={(currentPage / (pages.length - 1)) * 100}
                    className="mb-4"
                />

                {pages[currentPage]}

                <div className="flex justify-between mt-4">
                    {currentPage > 0 && (
                        <Button
                            type="button"
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            Zurück
                        </Button>
                    )}
                    {currentPage < pages.length - 1 ? (
                        <Button
                            type="button"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Weiter
                        </Button>
                    ) : (
                        <Button type="submit">Abschicken</Button>
                    )}
                </div>
            </form>
        </Form>
    );
}

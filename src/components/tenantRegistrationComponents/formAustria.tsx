"use client";
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerYear } from '@/components/date-picker-year';
import { CountryDropdown } from '@/components/country-dropdown-menu'

const genderOptions = [
    { value: 'männlich', label: 'Männlich' },
    { value: 'weiblich', label: 'Weiblich' },
    { value: 'divers', label: 'Divers' },
];

const documentTypes = [
    { value: 'reisepass', label: 'Reisepass' },
    { value: 'personalausweis', label: 'Personalausweis' },
];

const formSchema = z.object({
    familienname: z.string().min(1, 'Familienname ist erforderlich'),
    vorname: z.string().min(1, 'Vorname ist erforderlich'),
    geschlecht: z.enum(['männlich', 'weiblich', 'divers']),
    geburtsdatum: z.date(),
    staatsangehoerigkeit: z.string().min(1, "Staatsangehörigkeit ist erforderlich"),
    reisedokument: z.object({
        typ: z.enum(['reisepass', 'personalausweis']),
        ausstellungsdatum: z.date(),
        ausstellendeBehörde: z.string().min(1, 'Ausstellende Behörde ist erforderlich'),
        staat: z.string().min(1, 'Staat ist erforderlich'),
    }),
    adresse: z.object({
        strasse: z.string().min(1, 'Straße/Gasse/Platz ist erforderlich'),
        postleitzahl: z.string().min(1, 'Postleitzahl ist erforderlich'),
        ortsgemeinde: z.string().min(1, 'Ortsgemeinde ist erforderlich'),
        staat: z.string().min(1, 'Staat ist erforderlich'),
    }),
    mitreisende: z.array(z.object({
        familienname: z.string().min(1, 'Familienname ist erforderlich'),
        vorname: z.string().min(1, 'Vorname ist erforderlich'),
        geburtsdatum: z.date(),
    })),
    ankunftsdatum: z.date(),
    abreisedatum: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

export function FormAustria() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mitreisende: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'mitreisende',
    });

    const onSubmit = (data: FormValues) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="familienname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Familienname</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="vorname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vorname</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="geschlecht"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Geschlecht</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Geschlecht auswählen" />
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
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="geburtsdatum"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Geburtsdatum</FormLabel>
                            <DatePickerYear
                                date={field.value}
                                setDate={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="staatsangehoerigkeit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Staatsangehörigkeit</FormLabel>
                            <FormControl>
                                <CountryDropdown
                                    placeholder="Land auswählen"
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="reisedokument.typ"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reisedokument</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Dokumenttyp auswählen" />
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
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="reisedokument.ausstellungsdatum"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Ausstellungsdatum</FormLabel>
                            <DatePickerYear
                                date={field.value}
                                setDate={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="reisedokument.ausstellendeBehörde"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ausstellende Behörde</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="reisedokument.staat"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ausstellender Staat</FormLabel>
                            <CountryDropdown
                                placeholder="Land auswählen"
                                onChange={field.onChange}
                                value={field.value}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="adresse.strasse"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Straße/Gasse/Platz</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="adresse.postleitzahl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Postleitzahl</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="adresse.ortsgemeinde"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ortsgemeinde</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="adresse.staat"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Staat</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <h3 className="text-lg font-semibold">Mitreisende</h3>
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4">
                            <FormField
                                control={form.control}
                                name={`mitreisende.${index}.familienname`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Familienname</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`mitreisende.${index}.vorname`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vorname</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`mitreisende.${index}.geburtsdatum`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Geburtsdatum</FormLabel>
                                        <DatePickerYear
                                            date={field.value}
                                            setDate={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                Mitreisenden entfernen
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ familienname: '', vorname: '', geburtsdatum: new Date() })}
                    >
                        Mitreisenden hinzufügen
                    </Button>
                </div>

                <FormField
                    control={form.control}
                    name="ankunftsdatum"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Ankunftsdatum</FormLabel>
                            <DatePickerYear
                                date={field.value}
                                setDate={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="abreisedatum"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Voraussichtliches Abreisedatum</FormLabel>
                            <DatePickerYear
                                date={field.value}
                                setDate={field.onChange}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Formular absenden</Button>
            </form>
        </Form>
    );
}

"use client";
import React, {useState} from "react";

import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {DatePickerYear} from "@/components/date-picker-year";
import {DatePicker} from "@/components/date-picker";
import {CountryDropdown} from "@/components/country-dropdown-menu";
import {Progress} from "@/components/ui/progress";
import {useRouter} from "next/navigation";

const genderOptions = [
    { value: "männlich", label: "Männlich" },
    { value: "weiblich", label: "Weiblich" },
    { value: "divers", label: "Divers" },
];

const documentTypes = [
    { value: "reisepass", label: "Reisepass" },
    { value: "personalausweis", label: "Personalausweis" },
    { value: "führerschein", label: "Führerschein" },
];

function sanitizeInput(input: string): string {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}

const formSchema = z.object({
    familienname: z.string()
        .min(1, "Familienname ist erforderlich")
        .max(50, "Familienname darf maximal 50 Zeichen lang sein")
        .transform(sanitizeInput),
    vorname: z.string()
        .min(1, "Vorname ist erforderlich")
        .max(50, "Vorname darf maximal 50 Zeichen lang sein")
        .transform(sanitizeInput),
    geschlecht: z.enum(["männlich", "weiblich", "divers"]),
    geburtsdatum: z.date()
        .refine(date => date <= new Date(), "Geburtsdatum darf nicht in der Zukunft liegen")
        .refine(date => date != null, "Geburtsdatum ist erforderlich"),
    adresse: z.object({
        city: z.string()
            .min(1, { message: "Die Stadt ist erforderlich." })
            .max(100, "Stadtname darf maximal 100 Zeichen lang sein")
            .transform(sanitizeInput),
        postalCode: z.preprocess((val) => Number(val),
            z.number().int().positive("Postleitzahl muss eine positive Zahl sein")
                .max(99999, "Postleitzahl darf maximal 5 Ziffern haben")
        ),
        street: z.string()
            .min(1, { message: "Die Straße ist erforderlich." })
            .max(100, "Straßenname darf maximal 100 Zeichen lang sein")
            .transform(sanitizeInput),
        houseNumber: z.preprocess((val) => Number(val),
            z.number().int().positive("Die Hausnummer muss positiv sein.")
                .max(9999, "Hausnummer darf maximal 4 Ziffern haben")
        ),
        addressAdditional: z.string()
            .optional()
            .transform((val) => val ? sanitizeInput(val) : ""),
        staat: z.string()
            .min(1, { message: "Der Staat ist erforderlich." })
            .max(100, "Staatsname darf maximal 100 Zeichen lang sein")
            .transform(sanitizeInput),
    }),
    reisedokument: z.object({
        typ: z.enum(["reisepass", "personalausweis"]),
        ausstellungsdatum: z.date().refine(date => date <= new Date(), "Ausstellungsdatum darf nicht in der Zukunft liegen"),
        ausstellendeBehoerde: z.string()
            .min(1, "Ausstellende Behörde ist erforderlich")
            .max(100, "Behörde darf maximal 100 Zeichen lang sein")
            .transform(sanitizeInput),
        staat: z.string()
            .min(1, "Staat ist erforderlich")
            .max(100, "Staatsname darf maximal 100 Zeichen lang sein")
            .transform(sanitizeInput),
        reisepassNummer: z.string()
            .min(1, "Reisepassnummer ist erforderlich")
            .max(20, "Reisepassnummer darf maximal 20 Zeichen lang sein")
            .transform(sanitizeInput),
    }),
    ankunftsdatum: z.date().refine(date => date > new Date(), "Ankunftsdatum muss in der Zukunft liegen"),
    abreisedatum: z.date()
        .refine(date => date > new Date(), "Abreisedatum muss in der Zukunft liegen"),
    mitreisende: z.array(
        z.object({
            familienname: z.string()
                .nonempty("Familienname erforderlich")
                .max(50, "Familienname darf maximal 50 Zeichen lang sein")
                .transform(sanitizeInput),
            vorname: z.string()
                .nonempty("Vorname erforderlich")
                .max(50, "Vorname darf maximal 50 Zeichen lang sein")
                .transform(sanitizeInput),
            geburtsdatum: z.date()
                .refine(date => date <= new Date(), "Geburtsdatum darf nicht in der Zukunft liegen")
                .refine(date => date != null, "Geburtsdatum erforderlich"),
        })
    ).max(5, "Es können maximal 5 Mitreisende hinzugefügt werden"),
}).superRefine((data, ctx) => {
    // Hier vergleichen wir das Ankunftsdatum mit dem Abreisedatum
    if (data.abreisedatum && data.ankunftsdatum && data.abreisedatum <= data.ankunftsdatum) {
        ctx.addIssue({
            path: ['abreisedatum'],
            message: "Abreisedatum muss nach dem Ankunftsdatum liegen",
            code: z.ZodIssueCode.custom,
        });
    }
});

type FormValues = z.infer<typeof formSchema>;

export function FormAustria() {

    const router = useRouter()
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

    const validateCurrentPage = async () => {
        const fieldNames = [
            // Gib die Feldnamen an, die auf der aktuellen Seite geprüft werden sollen
            currentPage === 0 && ["familienname", "vorname", "geschlecht", "geburtsdatum"],
            currentPage === 1 && [
                "adresse.city",
                "adresse.postalCode",
                "adresse.street",
                "adresse.houseNumber",
                "adresse.staat",
            ],
            currentPage === 2 && [
                "reisedokument.typ",
                "reisedokument.ausstellungsdatum",
                "reisedokument.ausstellendeBehoerde",
                "reisedokument.staat",
            ],
            currentPage === 3 && ["ankunftsdatum", "abreisedatum"],
            currentPage === 4 && fields.map((_, index) => [
                `mitreisende.${index}.familienname`,
                `mitreisende.${index}.vorname`,
                `mitreisende.${index}.geburtsdatum`,
            ]).flat(),
        ].filter(Boolean).flat();

        if (fieldNames.length > 0) {
            return await form.trigger(fieldNames as Parameters<typeof form.trigger>[0]);
        }
        return true;
    };


    const handlePreviousPage = () => {
        setCurrentPage((prev) => prev - 1);
    };

    const onSubmit = (data: FormValues) => {
        console.log(data);
    }

    const handleSubmit = () => {
        router.push("/tenantRegistration/registrationComplete");
    };

    const pages = [
        <div key="page1">
            <h3 className="text-lg font-semibold">Persönliche Daten</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="vorname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Vorname<span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                            <Input {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="familienname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Familienname<span className="text-red-500 ml-1">*</span></FormLabel>
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
                            <FormLabel>Geschlecht<span className="text-red-500 ml-1">*</span></FormLabel>
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
                            <FormLabel>Geburtsdatum<span className="text-red-500 ml-1">*</span></FormLabel>
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
                            <FormLabel>Stadt<span className="text-red-500 ml-1">*</span></FormLabel>
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
                            <FormLabel>Postleitzahl<span className="text-red-500 ml-1">*</span></FormLabel>
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
                            <FormLabel>Straße<span className="text-red-500 ml-1">*</span></FormLabel>
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
                            <FormLabel>Hausnummer<span className="text-red-500 ml-1">*</span></FormLabel>
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
                            <FormLabel>Staatsangehörigkeit<span className="text-red-500 ml-1">*</span></FormLabel>
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
            <h3 className="text-lg font-semibold">Reisedokument<span className="text-red-500 ml-1">*</span></h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="reisedokument.typ"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Dokumenttyp<span className="text-red-500 ml-1">*</span></FormLabel>
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
                            <FormLabel>Ausstellungsdatum<span className="text-red-500 ml-1">*</span></FormLabel>
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
                    name="reisedokument.ausstellendeBehoerde"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Ausstellende Behörde<span className="text-red-500 ml-1">*</span></FormLabel>
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
                            <FormLabel>Ausstellender Staat<span className="text-red-500 ml-1">*</span></FormLabel>
                            <CountryDropdown
                                placeholder="Land auswählen"
                                onChange={field.onChange}
                                value={field.value}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reisedokument.reisepassNummer"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Reisepass Nummer<span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
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
                                <FormLabel>Ankunftsdatum<span className="text-red-500 ml-1">*</span></FormLabel>
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
                                <FormLabel>Voraussichtliches Abreisedatum<span
                                    className="text-red-500 ml-1">*</span></FormLabel>
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
                <h3 className="text-lg font-semibold mb-4">Mitreisende</h3>
                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 space-y-4">
                            <h4 className="text-md font-medium text-gray-700">Mitreisender {index + 1}</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name={`mitreisende.${index}.vorname`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Vorname<span className="text-red-500 ml-1">*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Vorname eingeben"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`mitreisende.${index}.familienname`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Familienname<span
                                                className="text-red-500 ml-1">*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Familienname eingeben"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`mitreisende.${index}.geburtsdatum`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Geburtsdatum<span
                                                className="text-red-500 ml-1">*</span></FormLabel>
                                            <DatePickerYear
                                                date={field.value}
                                                setDate={field.onChange}
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="mt-2"
                                    onClick={() => remove(index)}
                                >
                                    Mitreisenden entfernen
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {fields.length < 5 && (
                    <div className="mt-6 flex justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({familienname: '', vorname: '', geburtsdatum: new Date()})}
                        >
                            Mitreisenden hinzufügen
                        </Button>
                    </div>
                )}
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
                        <Button type="button" onClick={handlePreviousPage}>
                            Zurück
                        </Button>
                    )}
                    {currentPage < pages.length - 1 ? (
                        <Button
                            type="button"
                            onClick={async () => {
                                const isValid = await validateCurrentPage();
                                if (isValid) {
                                    setCurrentPage((prev) => prev + 1);
                                }
                            }}
                        >
                            Weiter
                        </Button>

                    ) : (
                        <Button type="submit" onClick={handleSubmit}>Abschicken</Button>
                    )}
                </div>
            </form>
        </Form>
    );
}

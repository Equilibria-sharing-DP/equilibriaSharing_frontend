"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { DatePicker  } from "@/components/date-picker";
import { DatePickerYear } from "@/components/date-picker-year";
import { CountryDropdown } from "@/components/country-dropdown-menu";
import { Progress } from "@/components/ui/progress";


const genderOptions = [
    { value: "MALE", label: "Männlich" },
    { value: "FEMALE", label: "Weiblich" },
    { value: "OTHER", label: "Divers" },
];

const documentTypes = [
    { value: "PASSPORT", label: "Reisepass" },
    { value: "ID_CARD", label: "Personalausweis" },
    { value: "DRIVING_LICENCE", label: "Führerschein" },
];

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/; // Erlaubt Buchstaben, Umlaute, Leerzeichen, Bindestrich, Apostroph
const alphanumericRegex = /^[A-Za-z0-9]+$/; // Nur Buchstaben & Zahlen für Dokumentnummern
const isAdult = (date: Date) => {
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return date <= minBirthDate;
};

const formSchema = z.object({
    accommodationId: z.number(),

    mainTraveler: z.object({
        firstName: z.string({
                required_error: "Vorname ist erforderlich",
            }).max(50, "Vorname darf maximal 50 Zeichen lang sein")
            .max(50, "Vorname darf maximal 50 Zeichen lang sein")
            .refine((value) => nameRegex.test(value), {
                message: "Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph sind erlaubt.",
            }),

        lastName: z.string({
                required_error: "Familienname ist erforderlich",
            }).max(50, "Familienname darf maximal 50 Zeichen lang sein")
            .refine((value) => nameRegex.test(value), {
                message: "Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph sind erlaubt.",
            }),

        gender: z.enum(["MALE", "FEMALE", "OTHER"], {
            required_error: "Geschlecht ist erforderlich",
        }),

        birthDate: z.date({
                required_error: "Geburtsdatum ist erforderlich",
            })
            .refine(date => date <= new Date(), "Geburtsdatum darf nicht in der Zukunft liegen")
            .refine(isAdult, "Der Hauptmieter muss mindestens 18 Jahre alt sein"),

        city: z.string({
                required_error: "Stadt ist erforderlich",
            }).max(100, "Stadtname darf maximal 100 Zeichen lang sein")
            .refine((value) => nameRegex.test(value), {
                message: "Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph sind erlaubt.",
            }),

        postalCode: z.preprocess(
            (val) => Number(val), // Wandelt Eingaben in Zahlen um
            z.number({
                required_error: "Postleitzahl ist erforderlich",
            })
                .int("Postleitzahl muss eine ganze Zahl sein")
                .positive("Postleitzahl muss positiv sein")
                .max(9999999, "Postleitzahl darf maximal 7 Ziffern haben")
        ),

        street: z.string({
                required_error: "Straße ist erforderlich",
            }).max(100, "Straßenname darf maximal 100 Zeichen lang sein")
            .refine((value) => nameRegex.test(value), {
                message: "Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph sind erlaubt.",
            }),

        houseNumber: z.preprocess(
            (val) => Number(val), // Wandelt Eingaben in Zahlen um
            z.number({
                    required_error: "Hausnummer ist erforderlich",
                })
                .int("Hausnummer muss eine ganze Zahl sein")
                .positive("Die Hausnummer muss positiv sein")
                .max(99999, "Hausnummer darf maximal 5 Ziffern haben")
        ),

        country: z.string({
                required_error: "Land ist erforderlich",
            }).max(100, "Landesname darf maximal 100 Zeichen lang sein")
            .refine((value) => nameRegex.test(value), {
                message: "Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph sind erlaubt.",
            }),

        addressAdditional: z.string()
            .max(100, "Zusätzliche Adressinfos dürfen maximal 100 Zeichen lang sein")
            .refine((value) => nameRegex.test(value), {
                message: "Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph sind erlaubt.",
            })
            .optional(),

        travelDocumentType: z.enum(["PASSPORT", "ID_CARD", "DRIVING_LICENCE"], {
            required_error: "Reisedokumenttyp ist erforderlich",
        }),

        issueDate: z.date({
            required_error: "Ausstellungsdatum ist erforderlich",
        }).refine(date => date <= new Date(), "Ausstellungsdatum darf nicht in der Zukunft liegen"),

        expiryDate: z.date({
            required_error: "Ablaufdatum ist erforderlich",
        }).refine(date => date > new Date(), "Ablaufdatum muss in der Zukunft liegen"),

        issuingAuthority: z.string({
            required_error: "Ausstellende Behörde ist erforderlich",
        }).max(100, "Behörde darf maximal 100 Zeichen lang sein")
            .refine((value) => nameRegex.test(value), {
                message: "Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph sind erlaubt.",
            }),

        issuingCountry: z.string({
            required_error: "Staat ist erforderlich",
        }).max(100, "Staatsname darf maximal 100 Zeichen lang sein"),

        documentNr: z.string({
                required_error: "Dokumentnummer ist erforderlich",
            }).max(20, "Dokumentnummer darf maximal 20 Zeichen lang sein")
            .regex(alphanumericRegex, "Nur Buchstaben und Zahlen erlaubt"),
    }),

    checkIn: z.date({
        required_error: "Ankunftsdatum ist erforderlich",
    }).refine(date => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Setze die Uhrzeit auf Mitternacht, damit nur das Datum verglichen wird
        return date >= today; // Stellt sicher, dass das Datum heute oder in der Zukunft liegt
    }, "Ankunftsdatum muss heute oder in der Zukunft liegen"),

    expectedCheckOut: z.date({
        required_error: "Abreisedatum ist erforderlich",
    }).refine(date => date > new Date(), "Abreisedatum muss in der Zukunft liegen"),

    additionalGuests: z.array(
        z.object({
            firstName: z.string({
                    required_error: "Vorname erforderlich",
                }).max(50, "Vorname darf maximal 50 Zeichen lang sein")
                .refine((value) => nameRegex.test(value), {
                    message: "Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph sind erlaubt.",
                }),

            lastName: z.string({
                    required_error: "Familienname erforderlich",
                }).max(50, "Familienname darf maximal 50 Zeichen lang sein")
                .refine((value) => nameRegex.test(value), {
                    message: "Nur Buchstaben, Leerzeichen, Bindestrich und Apostroph sind erlaubt.",
                }),

            birthDate: z.date({
                required_error: "Geburtsdatum erforderlich",
            }).refine(date => date <= new Date(), "Geburtsdatum darf nicht in der Zukunft liegen"),
        })
    ).max(5, "Es können maximal 5 Mitreisende hinzugefügt werden"),

}).refine((data) => data.expectedCheckOut > data.checkIn, {
    message: "Abreisedatum muss nach dem Ankunftsdatum liegen",
    path: ["expectedCheckOut"],
});

type FormValues = z.infer<typeof formSchema>;

export function FormAustria() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accommodationId: 1,
            additionalGuests: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'additionalGuests',
    });

    const validateCurrentPage = async () => {
        const fieldNames = [
            currentPage === 0 && ["mainTraveler.firstName", "mainTraveler.lastName", "mainTraveler.gender", "mainTraveler.birthDate"],
            currentPage === 1 && [
                "mainTraveler.city",
                "mainTraveler.postalCode",
                "mainTraveler.street",
                "mainTraveler.houseNumber",
                "mainTraveler.country",
            ],
            currentPage === 2 && [
                "mainTraveler.travelDocumentType",
                "mainTraveler.issueDate",
                "mainTraveler.expiryDate",
                "mainTraveler.issuingAuthority",
                "mainTraveler.issuingCountry",
                "mainTraveler.documentNr",
            ],
            currentPage === 3 && ["checkIn", "expectedCheckOut"],
            currentPage === 4 && fields.map((_, index) => [
                `additionalGuests.${index}.firstName`,
                `additionalGuests.${index}.lastName`,
                `additionalGuests.${index}.birthDate`,
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

    const handleNextPage = async () => {
        const isValid = await validateCurrentPage();
        if (isValid) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const onSubmit = async (data: FormValues) => {
        const formattedData = {
            ...data,
            mainTraveler: {
                ...data.mainTraveler,
                birthDate: new Date(data.mainTraveler.birthDate),
                issueDate: new Date(data.mainTraveler.issueDate),
                expiryDate: new Date(data.mainTraveler.expiryDate),
            },
            additionalGuests: data.additionalGuests.map(guest => ({
                ...guest,
                birthDate: new Date(guest.birthDate),
            })),
            checkIn: new Date(data.checkIn),
            expectedCheckOut: new Date(data.expectedCheckOut),
        };

        try {
            const parsedData = formSchema.parse(formattedData);
            const response = await fetch("http://localhost:8080/api/v1/bookings", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(parsedData)
            });

            if (!response.ok) {
                throw new Error(`Fehler: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Buchung erfolgreich erstellt:", result);
            router.push("/tenantRegistration/registrationComplete");
            return result;
        } catch (error) {
            console.error("Fehler beim Absenden des Formulars:", error);
        }
    };


    const pages = [
        <div key="page1">
            <h3 className="text-lg font-semibold">Persönliche Daten</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="mainTraveler.firstName"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>
                                Vorname<span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input {...field} error={!!fieldState.error}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mainTraveler.lastName"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>Familienname<span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                                <Input {...field} error={!!fieldState.error}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mainTraveler.gender"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>
                                Geschlecht<span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger error={!!fieldState.error} placeholder="Geschlecht auswählen" value={field.value}>
                                        <SelectValue/>
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
                    name="mainTraveler.birthDate"
                    render={({field, fieldState}) => (
                        <FormItem className="flex-1">
                            <FormLabel>Geburtsdatum<span className="text-red-500 ml-1">*</span></FormLabel>
                            <DatePickerYear
                                date={field.value}
                                setDate={field.onChange}
                                error={!!fieldState.error}
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
                    name="mainTraveler.city"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>Stadt<span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                                <Input {...field} error={!!fieldState.error}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mainTraveler.postalCode"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>Postleitzahl<span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    inputMode="numeric"
                                    pattern="\d+"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        field.onChange(Number(value));
                                    }}
                                    error={!!fieldState.error}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-3 gap-4 col-span-2">
                    <FormField
                        control={form.control}
                        name="mainTraveler.street"
                        render={({field, fieldState}) => (
                            <FormItem>
                                <FormLabel>Straße<span className="text-red-500 ml-1">*</span></FormLabel>
                                <FormControl>
                                    <Input {...field} error={!!fieldState.error}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mainTraveler.houseNumber"
                        render={({field, fieldState}) => (
                            <FormItem>
                                <FormLabel>Hausnummer<span className="text-red-500 ml-1">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        error={!!fieldState.error}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mainTraveler.addressAdditional"
                        render={({field, fieldState}) => (
                            <FormItem>
                                <FormLabel>Adresszusatz</FormLabel>
                                <FormControl>
                                    <Input {...field} error={!!fieldState.error}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="mainTraveler.country"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>Staatsangehörigkeit<span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                                <CountryDropdown
                                    placeholder="Land auswählen"
                                    onChange={field.onChange}
                                    error={!!fieldState.error}
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>
        ,
        <div key="page3">
            <h3 className="text-lg font-semibold">Reisedokument<span className="text-red-500 ml-1">*</span></h3>
            <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="mainTraveler.travelDocumentType"
                        render={({field, fieldState}) => (
                            <FormItem>
                                <FormLabel>
                                    Dokumenttyp<span className="text-red-500 ml-1">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger error={!!fieldState.error} placeholder="Dokumenttyp ausswählen" value={field.value}>
                                            <SelectValue/>
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
                    name="mainTraveler.documentNr"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>Dokumentnummer<span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                                <Input {...field} error={!!fieldState.error}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mainTraveler.issueDate"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>Ausstellungsdatum<span className="text-red-500 ml-1">*</span></FormLabel>
                            <DatePickerYear
                                date={field.value}
                                setDate={field.onChange}
                                error={!!fieldState.error}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mainTraveler.expiryDate"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>Ablaufdatum<span className="text-red-500 ml-1">*</span></FormLabel>
                            <DatePickerYear
                                date={field.value}
                                setDate={field.onChange}
                                error={!!fieldState.error}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mainTraveler.issuingAuthority"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>Ausstellende Behörde<span className="text-red-500 ml-1">*</span></FormLabel>
                            <FormControl>
                                <Input {...field} error={!!fieldState.error}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mainTraveler.issuingCountry"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>Ausstellender Staat<span className="text-red-500 ml-1">*</span></FormLabel>
                            <CountryDropdown
                                placeholder="Land auswählen"
                                onChange={field.onChange}
                                value={field.value}
                                error={!!fieldState.error}
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
                    name="checkIn"
                    render={({field, fieldState}) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Ankunftsdatum<span className="text-red-500 ml-1">*</span></FormLabel>
                            <DatePicker
                                date={field.value}
                                setDate={field.onChange}
                                error={!!fieldState.error}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expectedCheckOut"
                    render={({field, fieldState}) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Voraussichtliches Abreisedatum<span
                                className="text-red-500 ml-1">*</span></FormLabel>
                            <DatePicker
                                date={field.value}
                                setDate={field.onChange}
                                error={!!fieldState.error}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>,
        <div key="page5">
            <div>
                <h3 className="text-lg font-semibold mb-4">Mitreisende</h3>
                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="p-4 border rounded-lg shadow-sm space-y-4"
                        >
                            <h4 className="text-md font-medium">
                                Mitreisender {index + 1}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name={`additionalGuests.${index}.firstName`}
                                    render={({field, fieldState}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Vorname<span className="text-red-600 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Vorname eingeben"
                                                    error={!!fieldState.error}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`additionalGuests.${index}.lastName`}
                                    render={({field, fieldState}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Familienname<span
                                                className="text-red-600 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Familienname eingeben"
                                                    error={!!fieldState.error}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`additionalGuests.${index}.birthDate`}
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Geburtsdatum<span className="text-red-600 ml-1">*</span>
                                            </FormLabel>
                                            <DatePickerYear
                                                date={field.value}
                                                setDate={field.onChange}
                                                error={!!fieldState.error}
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
                            onClick={() => append({firstName: '', lastName: '', birthDate: new Date()})}
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

            <form className="space-y-8">
                <Progress
                    value={(currentPage / (pages.length - 1)) * 100}
                    className="mb-4"
                />

                {pages[currentPage]}

                <div className={`flex mt-4 ${currentPage === 0 ? "justify-end" : "justify-between"}`}>
                    {currentPage > 0 && (
                        <Button type="button" onClick={handlePreviousPage}>
                            Zurück
                        </Button>
                    )}
                    {currentPage < pages.length - 1 ? (
                        <Button
                            type="button"
                            onClick={handleNextPage}
                        >
                            Weiter
                        </Button>
                    ) : (
                        <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}>
                            Abschicken
                        </Button>
                    )}
                </div>
            </form>
        </Form>

    );

}
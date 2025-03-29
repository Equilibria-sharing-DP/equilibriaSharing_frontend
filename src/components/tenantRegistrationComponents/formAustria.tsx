"use client";
import React, {useState, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
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
import { CountryDropdown } from "@/components/country-dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {useTranslations} from 'next-intl';
const genderOptions = [
    { value: "MALE", label: "personalData.gender.male" },
    { value: "FEMALE", label: "personalData.gender.female" },
    { value: "OTHER", label: "personalData.gender.diverse" },
];

const documentTypes = [
    { value: "PASSPORT", label: "Reisepass" },
    { value: "ID_CARD", label: "Personalausweis" },
    { value: "DRIVING_LICENCE", label: "Führerschein" },
];

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s'-]+$/;// Erlaubt Buchstaben, Umlaute, Leerzeichen, Bindestrich, Apostroph
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
                required_error: "personalData.errors.firstName.required",
            }).max(50, "personalData.errors.firstName.maxlength")
            .refine((value) => nameRegex.test(value), {
                message: "personalData.errors.firstName.forbiddenCharacters",
            }),

        lastName: z.string({
                required_error: "personalData.errors.lastName.required",
            }).max(50, "personalData.errors.lastName.maxlength")
            .refine((value) => nameRegex.test(value), {
                message: "personalData.errors.lastName.forbiddenCharacters",
            }),

        gender: z.enum(["MALE", "FEMALE", "OTHER"], {
            required_error: "personalData.errors.gender.required",
        }),

        birthDate: z.date({
                required_error: "personalData.errors.birthdate.required",
            })
            .refine(date => date <= new Date(), "personalData.errors.birthdate.future")
            .refine(isAdult, "personalData.errors.birthdate.ageMainTenant"),

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
    ).max(10, "Es können maximal 10 Mitreisende hinzugefügt werden"),

}).refine((data) => data.expectedCheckOut > data.checkIn, {
    message: "Abreisedatum muss nach dem Ankunftsdatum liegen",
    path: ["expectedCheckOut"],
});

type FormValues = z.infer<typeof formSchema>;

type AccommodationDetails = {
    name: string;
    type: string;
    description: string;
    address: {
        city: string;
        country: string;
        postalCode: number;
        street: string;
        houseNumber: number;
        addressAdditional?: string;
    };
    maxGuests: number;
    pricePerNight: number;
    pictureUrls: string[];
};

export function FormAustria() {
    const t = useTranslations('form');

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [accommodationDetails, setAccommodationDetails] = useState<AccommodationDetails | null>(null);
    const searchParams = useSearchParams();

    // Lese den Base64-kodierten `data`-Parameter aus der URL
    const encodedData = searchParams.get("data");
    const urlParams = decodeUrlParams(encodedData);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accommodationId: urlParams?.accommodationId ?? undefined,
            checkIn: urlParams?.checkIn ?? undefined,
            expectedCheckOut: urlParams?.expectedCheckOut ?? undefined,
            additionalGuests: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'additionalGuests',
    });

    // Funktion zum Dekodieren der Base64-URL-Daten
    function decodeUrlParams(encodedData: string | null): { accommodationId: number; checkIn: Date; expectedCheckOut: Date } | null {
        if (!encodedData){
            router.push("/error?code=400")
            return null;
        }
        try {
            const decodedString = atob(encodedData); // Base64-String dekodieren
            const parsedData = JSON.parse(decodedString);

            // Prüfen, ob die notwendigen Felder existieren
            if (!parsedData.accommodationId || !parsedData.checkIn || !parsedData.expectedCheckOut) {
                router.push("/error?code=400")
                return null;
            }
            return {
                accommodationId: parsedData.accommodationId,
                checkIn: new Date(parsedData.checkIn),
                expectedCheckOut: new Date(parsedData.expectedCheckOut),
            };
        } catch (error) {
            router.push("/error?code=400")
            return null;
        }
    }

    useEffect(() => {
        const fetchAccommodationDetails = async () => {
            if (!urlParams) return;
            try {
                const response = await fetch(`http://localhost:8080/api/v1/accommodations/${urlParams.accommodationId}`);
                if (!response.ok) {
                    router.push("/error?code=400")
                }
                const data: AccommodationDetails = await response.json();
                setAccommodationDetails(data);
            } catch {
                router.push("/error?code=400")
            }
        };
        fetchAccommodationDetails();
    }, [urlParams?.accommodationId]);

    const validateCurrentPage = async () => {
        const fieldNames = [
            currentPage === 1 && ["mainTraveler.firstName", "mainTraveler.lastName", "mainTraveler.gender", "mainTraveler.birthDate"],
            currentPage === 2 && [
                "mainTraveler.city",
                "mainTraveler.postalCode",
                "mainTraveler.street",
                "mainTraveler.addressAdditional",
                "mainTraveler.houseNumber",
                "mainTraveler.country",
            ],
            currentPage === 3 && [
                "mainTraveler.travelDocumentType",
                "mainTraveler.issueDate",
                "mainTraveler.expiryDate",
                "mainTraveler.issuingAuthority",
                "mainTraveler.issuingCountry",
                "mainTraveler.documentNr",
            ],
            currentPage === 4 && fields.map((_, index) => [
                `additionalGuests.${index}.firstName`,
                `additionalGuests.${index}.lastName`,
                `additionalGuests.${index}.birthDate`,
            ]).flat(),
        ].filter(Boolean).flat();

        if (fieldNames.length > 1) {
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
                console.error(`Fehler: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            router.push("/tenantRegistration/registrationComplete");
            return result;
        } catch {
            router.push("/error?code=500")
        }
    };


    const pages = [
        <div key="page0">
            <div className="mb-6">
                <h3 className="text-lg font-semibold">{t('bookingInfo.title')}</h3>
                <p className="text-xs text-gray-500">{t('bookingInfo.subtitle')}</p>
                
                {/* Bilder */}
                <h4 className="text-base font-semibold mt-4">{t('bookingInfo.pictures.title')}</h4>
                <div className="grid grid-cols-2 gap-4">
                    {(accommodationDetails?.pictureUrls ?? []).slice(0, 3).length > 0 ? (
                        (accommodationDetails?.pictureUrls ?? []).slice(0, 3).map((url, index) => (
                            <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden shadow-sm">
                                <Image
                                    src={url}
                                    alt={`Bild ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-xs text-gray-500">{t('bookingInfo.pictures.error')}</p>
                    )}
                </div>
                
                <Separator className="my-4" />
                
                {/* Unterkunftsinfos */}
                <h3 className="text-base font-semibold">{t('bookingInfo.accommodationDetails.title')}</h3>
                <div className="gap-4 text-sm">
                    <p><strong>{t('bookingInfo.accommodationDetails.name')}:</strong> {accommodationDetails?.name ?? t('bookingInfo.error')}</p>
                    <p><strong>{t('bookingInfo.accommodationDetails.description')}:</strong> {accommodationDetails?.description ?? t('bookingInfo.error')}</p>
                    <p className="col-span-2">
                        <strong>{t('bookingInfo.accommodationDetails.title')}:</strong> {accommodationDetails
                            ? `${accommodationDetails.address.street} ${accommodationDetails.address.houseNumber}, 
                                ${accommodationDetails.address.postalCode} ${accommodationDetails.address.city}, 
                                ${accommodationDetails.address.country}`
                            : t('bookingInfo.error')}
                    </p>
                </div>
                
                <Separator className="my-4" />
                
                {/* Reisedaten */}
                <h3 className="text-base font-semibold">{t('bookingInfo.travelDates.title')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>{t('bookingInfo.travelDates.checkIn')}:</strong> {urlParams?.checkIn?.toLocaleDateString() ?? t('bookingInfo.error')}</p>
                    <p><strong>{t('bookingInfo.travelDates.expectedCheckOut')}:</strong> {urlParams?.expectedCheckOut?.toLocaleDateString() ?? t('bookingInfo.error')}</p>
                </div>
            </div>
        </div>,
        <div key="page1">
            <h3 className="text-lg font-semibold">{t('personalData.title')}</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="mainTraveler.firstName"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>
                            {t('personalData.firstName')}<span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input {...field} error={!!fieldState.error}/>
                            </FormControl>
                            <FormMessage />

                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mainTraveler.lastName"
                    render={({field, fieldState}) => (
                        <FormItem>
                            <FormLabel>{t('personalData.lastName')}<span className="text-red-500 ml-1">*</span></FormLabel>
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
                                {t('personalData.gender.title')}<span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger error={!!fieldState.error} placeholder={t('personalData.gender.genderPlaceholder')} value={field.value}>
                                        <SelectValue/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {genderOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {t(option.label)}
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
                            <FormLabel>{t('personalData.birthdate')}<span className="text-red-500 ml-1">*</span></FormLabel>
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
        </div>,
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

                {fields.length < 10 && (
                    <div className="mt-6 flex justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({firstName: '', lastName: '', birthDate: new Date() })}
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
                        <Button type="button" variant="secondary" onClick={handlePreviousPage}>
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
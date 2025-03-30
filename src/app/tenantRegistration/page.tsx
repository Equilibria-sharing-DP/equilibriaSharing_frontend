"use client"
import React, {useState, useEffect, ReactElement} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import { FormAustria } from "@/components/tenantRegistrationComponents/formAustria";
import { FormItaly } from "@/components/tenantRegistrationComponents/formItaly";
import {useTranslations} from 'next-intl';

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

export default function TenantRegistrationPage(): ReactElement {
    const [accommodationDetails, setAccommodationDetails] = useState<AccommodationDetails | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const encodedData = searchParams.get("data");
    const urlParams = decodeUrlParams(encodedData);
    const t = useTranslations('form');

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

    if (accommodationDetails && !['Austria', 'Italy'].includes(accommodationDetails.address.country)) {
        router.push("/error?code=400")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white sm:bg-gray-100 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-full sm:max-w-3xl">
                <div className="bg-white dark:bg-[#0A0A0A] shadow-lg dark:shadow-none border rounded-lg overflow-hidden sm:block hidden">
                    <div className="py-8 sm:p-10">
                        <h1 className="text-2xl sm:text-3xl font-semibold">
                            {t('title')}
                        </h1>
                        <p className="text-sm sm:text-base mb-6">
                            <span className="text-red-600">*</span> {t('subtitle')}
                        </p>
                        {accommodationDetails && (
                            accommodationDetails.address.country === 'Austria' ? (
                                <FormAustria
                                    initialAccommodationDetails={accommodationDetails}
                                    urlParams={urlParams || {}}
                                />
                            ) : (
                                <FormItaly
                                    initialAccommodationDetails={accommodationDetails}
                                    urlParams={urlParams || {}}
                                />
                            )
                        )}
                    </div>
                </div>
                <div className="sm:hidden w-full">
                    <div className="px-4 py-8">
                        <h1 className="text-2xl sm:text-3xl font-semibold">
                            {t('title')}
                        </h1>
                        <p className="text-sm sm:text-base mb-6">
                            <span className="text-red-600">*</span> {t('subtitle')}
                        </p>
                        {accommodationDetails && (
                            accommodationDetails.address.country === 'Austria' ? (
                                <FormAustria
                                    initialAccommodationDetails={accommodationDetails}
                                    urlParams={urlParams || {}}
                                />
                            ) : (
                                <FormItaly
                                    initialAccommodationDetails={accommodationDetails}
                                    urlParams={urlParams || {}}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

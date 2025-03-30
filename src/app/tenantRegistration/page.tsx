import React, { ReactElement } from "react";
import { FormAustria } from "@/components/tenantRegistrationComponents/formAustria";
import {useTranslations} from 'next-intl';

export default function TenantRegistrationPage(): ReactElement {
    const t = useTranslations('form');
    return (
        <div className="min-h-screen flex items-center justify-center bg-white sm:bg-gray-100 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-full sm:max-w-3xl">
                <div className="bg-white dark:bg-[#0A0A0A] shadow-lg dark:shadow-none border rounded-lg overflow-hidden sm:block hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <h1 className="text-2xl sm:text-3xl font-semibold">
                            {t('title')}
                        </h1>
                        <p className="text-sm sm:text-base mb-6">
                            <span className="text-red-600">*</span> {t('subtitle')}
                        </p>
                        <FormAustria />
                    </div>
                </div>
                <div className="sm:hidden w-full">
                    <div className="px-6 py-8">
                        <h1 className="text-2xl sm:text-3xl font-semibold">
                            {t('title')}
                        </h1>
                        <p className="text-sm sm:text-base mb-6">
                            <span className="text-red-600">*</span> {t('subtitle')}
                        </p>
                        <FormAustria />
                    </div>
                </div>
            </div>
        </div>


    );
}

import React, { ReactElement } from "react";
import { FormAustria } from "@/components/tenantRegistrationComponents/formAustria";
import {useTranslations} from 'next-intl';

export default function TenantRegistrationPage(): ReactElement {
    const t = useTranslations('form');
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full">
                <div className="bg-white dark:bg-[#0A0A0A] shadow-lg dark:shadow-none border rounded-lg overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <h1 className="text-2xl font-semibold">
                            {t('title')}
                        </h1>
                        <p className="text-sm mb-6">
                            <span className="text-red-600">*</span> {t('subtitle')}
                        </p>
                        <FormAustria />
                    </div>
                </div>
            </div>
        </div>
    );
}

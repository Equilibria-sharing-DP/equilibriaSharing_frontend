import type { ReactElement } from 'react';
import { FormAustria } from "@/components/tenantRegistrationComponents/formAustria";

export default function TenantRegistrationPage(): ReactElement {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h1 className="text-2xl font-semibold mb-6">Mieter Registrierung</h1>
                        <FormAustria />
                    </div>
                </div>
            </div>
        </div>
    );
}

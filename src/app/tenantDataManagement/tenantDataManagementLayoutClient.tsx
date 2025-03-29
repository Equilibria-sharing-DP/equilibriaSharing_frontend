// src/app/tenantDataManagement/tenantDataManagementLayoutClient.tsx
"use client";

import { Navbar } from "@/components/tenantDataManagementComponents/navbar";
import { Footer } from "@/components/tenantDataManagementComponents/footer";
import { usePathname } from "next/navigation";

export default function TenantDataManagementLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();  // Überprüft den aktuellen Pfad
    const isLoginPage = pathname === "/tenantDataManagement/login";  // Prüft, ob es sich um die Login-Seite handelt

    return (
        <>
            {!isLoginPage && <Navbar />}
            {children}
            {!isLoginPage && <Footer />}
        </>
    );
}

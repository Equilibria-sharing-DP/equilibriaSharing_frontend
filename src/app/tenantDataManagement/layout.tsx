"use client";
import localFont from "next/font/local";
import {Navbar} from "@/components/tenantDataManagementComponents/navbar";
import {Footer} from "@/components/footer";
import "@/app/globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {usePathname} from "next/navigation";
import Head from "next/head";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export default function TenantDataManagementLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/tenantDataManagement/login";

    return (
        <html lang="en">
        <Head>
            {/* Favicon */}
            <link rel="icon" href="/img/icon.png" type="image/x-icon" />

            {/* Titel der Seite */}
            <title>Equilibira Sharing - Mieterdaten Management</title>

            {/* Meta Tags */}
            <meta name="description" content="Verwalte Mieterdaten effizient und sicher mit Equilibira Sharing." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* Navbar und Footer nur anzeigen, wenn nicht Login-Seite */}
            {!isLoginPage && <Navbar />}
            {children}
            {!isLoginPage && <Footer />}
        </ThemeProvider>
        </body>
        </html>
    );
}

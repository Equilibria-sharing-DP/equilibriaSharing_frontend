import localFont from "next/font/local";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";
import TenantDataManagementLayoutClient from "./tenantDataManagementLayoutClient"; // Die Client-Komponente

// Local Fonts
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

export const metadata = {
    title: "Equilibira Sharing - Mieterdaten Management",
    icons: {
        icon: "/img/icon.png",
    },
};

export default function TenantDataManagementLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <Head>
            <link rel="icon" href="/img/icon.png" type="image/x-icon" />
            <meta name="description" content="Verwalte Mieterdaten effizient und sicher mit Equilibira Sharing." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TenantDataManagementLayoutClient>{children}</TenantDataManagementLayoutClient>
        </ThemeProvider>
        </body>
        </html>
    );
}

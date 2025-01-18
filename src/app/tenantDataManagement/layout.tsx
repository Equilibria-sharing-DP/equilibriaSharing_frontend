import localFont from "next/font/local";
import {Navbar} from "@/components/tenantDataManagmentComponents/navbar";
import {Footer} from "@/components/footer"
import "../globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import Head from "next/head";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900",
});

export const metadata = {
    title: "Equilibira Sharing - Mieterdaten Management",
    icons: {
        icon: "/img/icon.png",
    },
};

export default function TenantDataManagementLayout({
                                                       children,
                                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <Head>
            {/* Favicon */}
            <link rel="icon" href="/img/icon.png" type="image/x-icon" />wsa

            {/* Titel der Seite */}
            <title>Equilibira Sharing - Mieterdaten Management</title>

            {/* Meta Tags */}
            <meta name="description" content="Verwalte Mieterdaten effizient und sicher mit Equilibira Sharing." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar/>
            {children}
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}

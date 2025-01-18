import localFont from "next/font/local";
import {Navbar} from "@/components/tenantRegistrationComponents/navbar";
import "../globals.css";

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

export default function TenantRegistrationLayout ({
        children,
    }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

            <Navbar/>
            {children}
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                TenantRegistration Footer
            </footer>

        </body>
        </html>
    );
}

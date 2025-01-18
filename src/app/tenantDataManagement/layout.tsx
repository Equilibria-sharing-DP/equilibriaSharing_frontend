import localFont from "next/font/local";
import {Navbar} from "@/components/tenantDataManagmentComponents/navbar";
import "../globals.css";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900",
});

export default function TenantDataManagementLayout({
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
                    Footer TenantDataManagement
                </footer>
        </body>
        </html>
    );
}

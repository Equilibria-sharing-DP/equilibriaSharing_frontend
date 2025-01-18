import localFont from "next/font/local";
import {Navbar} from "@/components/tenantDataManagmentComponents/navbar";
import {Footer} from "@/components/footer"
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
                <Footer />
        </body>
        </html>
    );
}

import localFont from "next/font/local";
import {Navbar} from "@/components/tenantRegistrationComponents/navbar";
import "@/app/globals.css";
import {Footer} from "@/components/footer";
import {ThemeProvider} from "@/components/theme-provider";

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

export default function TenantRegistrationLayout({
                                                     children,
                                                 }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="white" enableSystem>
            <Navbar/>
            {children}
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}

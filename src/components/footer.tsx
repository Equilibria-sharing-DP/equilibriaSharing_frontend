import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";

export function Footer() {
    return (
        <footer className="container relative p-8 mx-auto xl:px-0">
            <div
                className="grid max-w-screen-xl grid-cols-1 gap-4 mx-auto  lg:grid-cols-3">
                <div className="flex justify-center lg:justify-start">

                    <span className="flex space-x-2">
                      <Image
                          src="/img/logo.webp"
                          alt="Logo"
                          width={240}
                          height={240}
                      />
                    </span>

                </div>
                <div className="flex flex-col items-center justify-center mt-12 lg:mt-0">
                    <Button asChild variant="link">
                        <Link href="/impressum">Impressum</Link>
                    </Button>
                    <Button asChild variant="link">
                        <Link href="/kontakt">Kontakt</Link>
                    </Button>
                    <Button asChild variant="link">
                        <Link href="/datenschutz">Datenschutz</Link>
                    </Button>
                </div>
                <div
                    className="flex flex-col items-center justify-center mt-12 text-center lg:items-end lg:justify-end lg:text-right lg:mt-0 mb-14">
                    <h3>Diplomarbeit - Equilibira Sharing</h3>
                    <p>Wexstraße 19-23</p>
                    <p>1200 Wien</p>
                    <p>Copyright © 2024</p>
                    <p>All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useTranslations} from 'next-intl';

export function Footer() {
    const t = useTranslations('footer');
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
                <div className="flex flex-col items-center justify-center mt-12 lg:mt-0 space-y-2">
                    <Button asChild variant="link"
                            className="text-black dark:text-white hover:text-black ">
                        <Link href="https://equilibria.at/impressum/">{t('imprint')}</Link>
                    </Button>
                    <Button asChild variant="link"
                            className="text-black dark:text-white hover:text-black ">
                        <Link href="https://equilibria.at/kontakt/">{t('contact')}</Link>
                    </Button>
                    <Button asChild variant="link"
                            className="text-black dark:text-white hover:text-black ">
                        <Link href="https://equilibria.at/datenschutz/">{t('privacyPolicy')}</Link>
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center mt-12 text-center lg:items-end lg:justify-end lg:text-right lg:mt-0 mb-14">
                    <h3>equilibria Immobilienmanagement GmbH</h3>
                    <p>Am grünen Prater 13/1</p>
                    <p>1020 Wien</p>
                    <p>Copyright © 2024</p>
                    <p>All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
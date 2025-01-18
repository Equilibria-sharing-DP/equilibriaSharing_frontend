import Link from "next/link";
import Image from "next/image";
import React from "react";

export const Footer = () => {
    return (
        <div className="relative container p-8 mx-auto xl:px-0">

                <div className="grid max-w-screen-xl grid-cols-1 lg:grid-cols-3 gap-4 pt-10 mx-auto border-t border-gray-10">
                    <div className="flex justify-center lg:justify-start">
                        <Link href="/">
              <span className="flex space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100">
                <Image
                    src="/img/logo.webp"
                    alt="Logo"
                    width="240"
                    height="240"
                />
              </span>
                        </Link>
                    </div>
                    <div className="flex justify-center items-center flex-col mt-[3rem] lg:mt-0"></div>
                    <div className="flex justify-center text-center align-middle lg:justify-end lg:text-right flex-col mt-[3rem] lg:mt-0 mb-14">
                        <h3>Diplomarbeit - Equilibira Sharing</h3>
                        <p>Wexstraße 19-23</p>
                        <p>1200 Wien</p>
                        <p>Copyright © 2024</p>
                        <p>All rights reserved.</p>
                    </div>
                </div>

        </div>
    );
};

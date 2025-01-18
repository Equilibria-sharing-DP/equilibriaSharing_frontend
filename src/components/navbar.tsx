"use client";
import Link from "next/link";

export const Navbar = () => {
    const navigation = [
        "Projektbeschreibung",
        "Team",
        "Fortschritt",
        "Meilensteine",
    ];
    return (
        <div className="w-full">
            <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-1">
                <Link href="/">
                  <span className="flex items-center space-x-2 text-2xl font-medium ">
                    <span>Equilibira Sharing</span>
                  </span>
                </Link>

                <div className="hidden text-center lg:flex lg:items-center">
                    <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
                        {navigation.map((menu, index) => {
                            const sectionId = String(menu) // Sicherstellen, dass `menu` ein String ist
                                .toLowerCase()
                                .replace(/\s+/g, "-") // Ersetze Leerzeichen mit "-"
                                .replace(/[^a-z0-9-]/g, ""); // Entferne ungültige Zeichen, die in einer ID nicht erlaubt sind

                            return (
                                <li className="mr-3 nav__item" key={index}>
                                    <Link
                                        href={`#${sectionId}`} // Link zur dynamischen ID
                                        className="inline-block px-4 py-2 text-lg font-medium text-gray-800 no-underline rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:text-equilibiraGreen focus:text-equilibiraGreen focus:bg-lime-100 focus:outline-none focus:ring-2 focus:ring-equilibiraGreen focus:ring-opacity-50 dark:text-gray-200 dark:hover:text-equilibiraGreen dark:focus:bg-gray-800"

                                    >
                                        {menu}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </div>
    );
};
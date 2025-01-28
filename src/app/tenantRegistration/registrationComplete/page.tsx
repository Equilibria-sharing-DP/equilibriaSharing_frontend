import Image from "next/image";

export default function RegistrationSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
            <div className="mb-8">
                <Image
                    src="/img/logo.webp"
                    alt="Equilibria Sharing"
                    width={520}
                    height={520}
                    priority
                    className="mx-auto"
                />
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Registrierung erfolgreich!</h1>
                <p className="text-gray-600">Vielen Dank für Ihre Registrierung. Sie können dieses Fenster nun schließen!</p>
            </div>
        </div>
    );
}

import { LoginForm } from "@/components/tenantDataManagementComponents/LoginForm"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white p-4">
      <div className="md:w-2/5 mb-8 md:mb-0 md:mr-8">
        <Image
          src="/img/logo.webp"
          alt="Equilibria Sharing"
          width={520}
          height={520}
          priority
          className="mx-auto"
        />
      </div>
      <div className="md:w-2/5">
        <LoginForm />
      </div>
    </div>
  )
}
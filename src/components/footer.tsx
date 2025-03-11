import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-[#A8C947] py-4 mt-auto">
      <div className="container relative mx-auto xl:px-0">
        <div className="grid max-w-screen-xl grid-cols-1 gap-4 mx-auto lg:grid-cols-3">
          <div className="flex justify-center lg:justify-start items-center pl-8 lg:pl-16">
            <div className="rounded-full overflow-hidden w-20 h-20">
            <Link href="/tenantDataManagement/properties" className="rounded-full overflow-hidden w-20 h-20 mr-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sharing.png-1lBT9Vx3mksu8daLtBHje4uyPFJy2S.png"
                alt="Equilibria Sharing Logo"
                width={200}
                height={200}
                className="object-contain"
              />
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-4 lg:mt-0 space-y-1">
            <Button
              asChild
              variant="link"
              className="text-white hover:bg-[#8AB83B] px-2 py-0.5 rounded transition-colors font-bold"
            >
              <Link href="/impressum">Impressum</Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-white hover:bg-[#8AB83B] px-2 py-0.5 rounded transition-colors font-bold"
            >
              <Link href="/kontakt">Kontakt</Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-white hover:bg-[#8AB83B] px-2 py-0.5 rounded transition-colors font-bold"
            >
              <Link href="/datenschutz">Datenschutz</Link>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center mt-4 text-center lg:items-end lg:justify-end lg:text-right lg:mt-0 text-white text-sm pr-8 lg:pr-16">
            <h3 className="font-bold">Diplomarbeit - Equilibria Sharing</h3>
            <p>Wexstraße 19-23</p>
            <p>1200 Wien</p>
            <p>Copyright © 2024</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}


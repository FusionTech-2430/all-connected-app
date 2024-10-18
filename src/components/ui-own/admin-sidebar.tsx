import Image from 'next/image'
import NavBar from './admin-nav-bar'
import NavItem from './nav-item'
import { LifeBuoy } from 'lucide-react'

export default function Sidebar() {
  return (
    <>
      <aside className="hidden w-72 gap-6 h-full flex-col border-r bg-background items-start py-4 px-2 sm:flex">
        {/* Sidebar header */}
        <div className="pl-2">
          <Image
            src={'/all-connected-banner.png'}
            alt="All Connected banner"
            width={192}
            height={192}
            priority
          />
        </div>

        {/* Sidebar Body */}
        <NavBar className="w-full flex flex-col items-start gap-1 px-2 sm:py-5 h-full" />

        {/* Sidebar footer */}
        <div className="flex flex-col justify-start w-full gap-1 px-2">
          <NavItem
            href="/support"
            icon={<LifeBuoy size={20} />}
            title="Soporte técnico"
          />
        </div>
      </aside>
    </>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarNavItemProps {
  icon: React.ReactNode
  href: string
  title: string
}

export default function NavItem({ icon, title, href }: SidebarNavItemProps) {
  const pathname = usePathname()

  return (
    <>
      <Link
        href={href}
        className={`flex w-full p-2 gap-2 items-center justify-start rounded-md transition-colors ${pathname.startsWith(href) ? 'bg-primary-200' : 'hover:bg-primary-200'}`}
        prefetch={false}
      >
        {icon}
        <span>{title}</span>
      </Link>
    </>
  )
}

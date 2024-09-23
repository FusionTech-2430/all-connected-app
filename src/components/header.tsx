import Image from 'next/image'

import { Bell, LifeBuoy, MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import NavItem from './nav-item'
import { ThemeToggle } from '@/components/theme-toggle'
import NavBar from './nav-bar'
import Link from 'next/link'

import UserAvatar from '@/components/user-avatar'

type HeaderProps = React.ComponentProps<'header'>

export function AppHeader({ children, ...props }: HeaderProps) {
  return (
    <>
      <header {...props}>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <MenuIcon size={20} />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            {/* Metadata for screen readers */}
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Principal navigation
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col h-full gap-6">
              <Image
                src={'/all-connected-banner.png'}
                alt="All Connected banner"
                width={192}
                height={192}
                priority
              />

              <NavBar className="grid gap-2 text-lg" />

              <div className="flex flex-col justify-end items-start w-full h-full text-lg">
                <NavItem
                  href="/support"
                  icon={<LifeBuoy size={20} />}
                  title="Soporte técnico"
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {children}
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline">Comprar</Button>
          <Button className="bg-primary hover:bg-primary-600">
            Mejora tu membresía
          </Button>
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <ThemeToggle />
          <UserAvatar />
        </div>
      </header>
    </>
  )
}

export function PublicHeader() {
  return (
    <header className="bg-primary-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* <Globe className="h-6 w-6" /> */}
          <Image
            src={'/white-logo.png'}
            alt="AllConnected logo"
            width={32}
            height={32}
          />

          <span className="font-bold text-xl">AllConnected</span>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <Link href="#features" className="hover:underline">
                Características
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="hover:underline">
                Precios
              </Link>
            </li>
            <li>
              <Link href="#benefits" className="hover:underline">
                Acerca de
              </Link>
            </li>
            <li>
              <Link href="#contact-us" className="hover:underline">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
        <div className="hidden md:flex space-x-2">
          <Button variant="outline" className="text-primary-900">
            uenta
          </Button>
        </div>
      </div>
    </header>
  )
}

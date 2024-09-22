import Image from 'next/image'

import { LifeBuoy, MenuIcon } from 'lucide-react'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet'
import NavItem from './nav-item'
import { ThemeToggle } from './theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import NavBar from './nav-bar'

type HeaderProps = React.ComponentProps<'header'>

export default function Header({ children, ...props }: HeaderProps) {
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
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}

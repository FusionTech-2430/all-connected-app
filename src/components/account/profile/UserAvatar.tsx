'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { logOut } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function UserAvatar() {
  const router = useRouter()

  const handleLogOut = () => {
    logOut()
    sessionStorage.removeItem('id-user')
    router.push('/')
  }
  const handleSettings = () => {
    logOut()
    router.push('/profile')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSettings}>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

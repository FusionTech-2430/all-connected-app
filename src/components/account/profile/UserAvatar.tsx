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
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type User } from '@/types/users/user'

function getInitials(name: string): string {
  const initials = name.split(' ').slice(0, 2).map(word => word.toUpperCase()[0]).join('');
  return initials.toUpperCase();
}

export default function UserAvatar() {
  const router = useRouter()

  const user: User | null = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null
  console.log('Usuario:', user)

  if(!user) {
    router.push('/')
  }

  const handleLogOut = () => {
    logOut()
    sessionStorage.removeItem('id-user')
    router.push('/')
  }
  const handleSettings = () => {
    logOut()
    router.push('/profile')
  }
  const photoUrl = user?.photo_url || ''
  const userName = user?.fullname || ''

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              {photoUrl ? (
                <Image src={photoUrl} alt="User Avatar" width={50} height={50} />
              ) : (
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              )}
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

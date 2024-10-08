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
import { useEffect, useState } from 'react'

function getInitials(name: string): string {
  const initials = name.split(' ').slice(0, 2).map(word => word.toUpperCase()[0]).join('');
  return initials.toUpperCase();
}

export default function UserAvatar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        router.push('/')
      }
    }
  }, [router])

  const handleLogOut = () => {
    logOut()
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('id-user')
    }
    router.push('/')
  }

  const handleSettings = () => {
    router.push('/profile')
  }

  const userName = user?.fullname || ''
  const photoUrl = user?.photo_url || ''

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {photoUrl ? (
                <Image src={photoUrl} alt="User Avatar" />
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
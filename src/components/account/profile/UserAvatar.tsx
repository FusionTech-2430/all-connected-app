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
import Image from 'next/image'

import { jwtDecode } from 'jwt-decode'

import Link from 'next/link'
import SignOut from '@/components/auth/sign-out-dropdown-item'
import { cookies } from 'next/headers'
import { JwtClaims } from '@/types/auth/jwt-claims'
import { getUser } from '@/services/userService'

function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.toUpperCase()[0])
    .join('')
  return initials.toUpperCase()
}

export default async function UserAvatar() {
  // Decode the JWT token to get the user's name and photo URL
  const cookieStore = cookies()

  const token = cookieStore.get('access-token')

  if (!token) {
    return null
  }

  const decodedToken = jwtDecode<JwtClaims>(token?.value)
  const userId = decodedToken.user_id
  const roles = decodedToken.roles

  const { photo_url, username } = await getUser(userId)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {photo_url ? (
                <Image
                  src={photo_url}
                  alt="User Avatar"
                  width={80}
                  height={80}
                />
              ) : (
                <AvatarFallback>{getInitials(username)}</AvatarFallback>
              )}
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi perfil</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link className="w-full" href= {roles.includes('admin')?'/admin/profile':'/profile'} >
              Ajustes
            </Link>
          </DropdownMenuItem>
            {!roles.includes('admin') && (
            <>
              <DropdownMenuItem>
              <Link className="w-full" href="/my-orders">
                Mis Pedidos
              </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
              <Link className="w-full" href="/use-token">
                Usar Token
              </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Soporte</DropdownMenuItem>
            </>
            )}
          <DropdownMenuSeparator />
          <SignOut />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

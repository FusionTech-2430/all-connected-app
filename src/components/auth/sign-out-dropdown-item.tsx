'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/actions/auth'
import { LogOut } from 'lucide-react'

export default function SignOutDropdownItem() {
  return (
    <DropdownMenuItem className="gap-1" onClick={() => signOut()}>
      <LogOut size={16} />
      <span>Cerrar sesión</span>
    </DropdownMenuItem>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { MoreHorizontal, Search } from 'lucide-react'
import Image from 'next/image'
import { User } from '@/types/users/user'
import { getUsers } from '@/lib/api/users'
import { ActivateDeactivateButton } from './ActivateDeactiveButton'
import { DeleteUserButton } from './DeleteUserButton'

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id_user === updatedUser.id_user ? updatedUser : user
      )
    )
  }

  const handleUserDeleted = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id_user !== userId))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
      <div className="flex justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o rol..."
            className="pl-8 w-[300px]"
          />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id_user}>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-8 h-8 relative mr-2">
                    <Image
                      src={user.photo_url || '/placeholder.svg'}
                      alt={user.fullname}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div>{user.fullname}</div>
                    <div className="text-sm text-gray-500">{user.mail}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${user.active ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  {user.active ? 'Activo' : 'Inactivo'}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <ActivateDeactivateButton
                      user={user}
                      onUserUpdated={handleUserUpdated}
                    />
                    <DeleteUserButton
                      user={user}
                      onUserDeleted={handleUserDeleted}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <div>Total: {users.length} usuarios</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            &lt;&lt;
          </Button>
          <Button variant="outline" size="sm">
            &lt;
          </Button>
          <div>Página 1 de 10</div>
          <Button variant="outline" size="sm">
            &gt;
          </Button>
          <Button variant="outline" size="sm">
            &gt;&gt;
          </Button>
        </div>
      </div>
    </div>
  )
}

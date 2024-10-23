'use client'

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MoreHorizontal, Search, AlertTriangle } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'activo' | 'inactivo' | 'bloqueado'
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([
    { id: 'CN', name: 'Camilo Nossa', email: 'calejandro@fusiontech.com', role: 'Dueño', status: 'inactivo' },
    { id: 'VE', name: 'Valentina Escobar', email: 'tina_vale@fusiontech.com', role: 'Aliado', status: 'inactivo' },
    { id: 'DP', name: 'Diego Pardo', email: 'pardiego@fusiontech.com', role: 'Dueño', status: 'activo' },
    { id: 'CR', name: 'Carlos Rojas', email: 'carlosroj@fusiontech.com', role: 'Consumidor', status: 'bloqueado' },
    { id: 'ES', name: 'Esteban Salazar', email: 'estebans@fusiontech.com', role: 'Aliado', status: 'activo' },
  ])
  const [warningOpen, setWarningOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleStatusChange = (user: User) => {
    if (user.status === 'activo' || user.status === 'inactivo') {
      setSelectedUser(user)
      setWarningOpen(true)
    } else {
      updateUserStatus(user.id)
    }
  }

  const updateUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'bloqueado' ? 'activo' : 'bloqueado'
        }
      }
      return user
    }))
    setWarningOpen(false)
    setSelectedUser(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activo':
        return <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
      case 'inactivo':
        return <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2" />
      case 'bloqueado':
        return <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
      <div className="flex justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o rol..." className="pl-8 w-[300px]" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
            <SelectItem value="bloqueado">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    {user.id}
                  </div>
                  <div>
                    <div>{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getStatusIcon(user.status)}
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                    <DropdownMenuItem onClick={() => handleStatusChange(user)}>
                      {user.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
                    </DropdownMenuItem>
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
          <Button variant="outline" size="sm">&lt;&lt;</Button>
          <Button variant="outline" size="sm">&lt;</Button>
          <div>Página 1 de 10</div>
          <Button variant="outline" size="sm">&gt;</Button>
          <Button variant="outline" size="sm">&gt;&gt;</Button>
        </div>
      </div>

      <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Advertencia: Bloquear Usuario
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Está a punto de bloquear al usuario {selectedUser?.name}. Esta acción tendrá un efecto permanente en la cuenta del usuario. ¿Está seguro de que desea continuar?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarningOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => selectedUser && updateUserStatus(selectedUser.id)}>Bloquear Usuario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
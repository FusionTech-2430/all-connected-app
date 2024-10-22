'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react"

interface Account {
  id: string
  name: string
  creationDate: string
  email: string
  mobile: string
}

export default function AccountAdministration() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Javeriana', creationDate: '20-06-2024', email: 'puj@javeriana.edu.co', mobile: '3216589471' },
    { id: '2', name: 'Andes', creationDate: '17-07-2024', email: 'uniandes@andes.edu.co', mobile: '3124569874' },
    { id: '3', name: 'Externado', creationDate: '23-07-2024', email: 'ext123@externado.edu.co', mobile: '3014587451' },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null)

  const handleOpenDialog = (account: Account | null = null) => {
    setCurrentAccount(account)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCurrentAccount(null)
    setIsDialogOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newAccount: Account = {
      id: currentAccount?.id || String(accounts.length + 1),
      name: formData.get('name')?.toString() || '',
      creationDate: new Date().toLocaleDateString('es-ES'),
      email: formData.get('email')?.toString() || '',
      mobile: formData.get('mobile')?.toString() || '',
    }

    if (currentAccount) {
      setAccounts(accounts.map(acc => acc.id === currentAccount.id ? newAccount : acc))
    } else {
      setAccounts([...accounts, newAccount])
    }

    handleCloseDialog()
  }

  const handleDelete = (account: Account) => {
    setCurrentAccount(account)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentAccount) {
      setAccounts(accounts.filter(acc => acc.id !== currentAccount.id))
      setCurrentAccount(null)
    }
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Administración de Cuentas</h1>
      <p className="text-gray-600 mb-4">Gestiona todas las cuentas de organización de forma centralizada.</p>
      <div className="flex justify-between mb-4">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Crear nueva cuenta
        </Button>
        <Input className="w-1/3" placeholder="Buscar organización..." />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre de Organización</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead>Email de Contacto</TableHead>
            <TableHead>Celular</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.creationDate}</TableCell>
              <TableCell>{account.email}</TableCell>
              <TableCell>{account.mobile}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenDialog(account)}>
                      <Pencil className="mr-2 h-4 w-4 text-yellow-500" />
                      Modificar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(account)}>
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" /> 
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4">
          <div>
            <p className="text-sm font-semibold">Cantidad de Cuentas</p>
            <p className="text-2xl font-bold text-blue-600">{accounts.length}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Cuentas Activas</p>
            <p className="text-2xl font-bold text-green-600">{accounts.length}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Cuentas Inactivas</p>
            <p className="text-2xl font-bold text-red-600">0</p>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {currentAccount ? 'Editar cuenta' : 'Crear nueva cuenta'}
            </DialogTitle>
            <DialogDescription>
              {currentAccount ? 'Modifica la información de la cuenta' : 'Ingresa la información de la nueva cuenta'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de Organización</Label>
              <Input id="name" name="name" defaultValue={currentAccount?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de Contacto</Label>
              <Input id="email" name="email" type="email" defaultValue={currentAccount?.email} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Celular</Label>
              <Input id="mobile" name="mobile" defaultValue={currentAccount?.mobile} required />
            </div>
            <Button type="submit" className="w-full">{currentAccount ? 'Guardar cambios' : 'Crear cuenta'}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
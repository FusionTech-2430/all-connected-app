'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Pencil, Trash2, X } from "lucide-react"
import { Business } from '@/types/business'
import { Organizations } from '@/types/organizations'
import { getOrganizationById } from '@/lib/api/organizations'

interface BusinessManagementProps {
  businesses: Business[]
}

export default function BusinessManagement({ businesses }: BusinessManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null)
  const [organizations, setOrganizations] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrganizations = async () => {
      const orgs: { [key: string]: string } = {}
      for (const business of businesses) {
        if (business.organizations) {
          for (const orgId of business.organizations) {
            if (!orgs[orgId]) {
              console.log(`Fetching organization with ID: ${orgId}`)
              const organization = await getOrganizationById(orgId)
              orgs[orgId] = organization.name
            }
          }
        }
      }
      setOrganizations(orgs)
      setIsLoading(false)
    }
    fetchOrganizations()
  }, [businesses])

  const handleOpenDialog = (business: Business | null = null) => {
    setCurrentBusiness(business)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCurrentBusiness(null)
    setIsDialogOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission logic here
    handleCloseDialog()
  }

  const handleDelete = (business: Business) => {
    setCurrentBusiness(business)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Handle delete logic here
    setIsDeleteDialogOpen(false)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Dueño</TableHead>
            <TableHead>Organización</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.map((business) => (
            <TableRow key={business.id_business}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 relative flex-shrink-0">
                    <Image
                      src={business.logo_url || "/placeholder.svg"}
                      alt={`${business.name} logo`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <span>{business.name}</span>
                </div>
              </TableCell>
              <TableCell>{business.owner_id}</TableCell>
              <TableCell>
                {business.organizations?.map((orgId) => organizations[orgId] || orgId).join(', ')}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleOpenDialog(business)}>
                      <Pencil className="mr-2 h-4 w-4 text-yellow-500" />
                      Modificar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleDelete(business)}>
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
        <p className="text-sm text-gray-500">Total: {businesses.length} emprendimientos.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">&lt;&lt;</Button>
          <Button variant="outline" size="sm">&lt;</Button>
          <span className="text-sm">Página 1 de 2</span>
          <Button variant="outline" size="sm">&gt;</Button>
          <Button variant="outline" size="sm">&gt;&gt;</Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {currentBusiness ? 'Editar negocio' : 'Crear un nuevo negocio'}
              <Button variant="ghost" size="icon" onClick={handleCloseDialog}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              {currentBusiness ? 'Modifica la información del negocio' : 'Llena el formulario con la información del negocio'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Nombre del negocio" defaultValue={currentBusiness?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Dueño</Label>
              <Input id="owner" name="owner" placeholder="ID del dueño" defaultValue={currentBusiness?.owner_id} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organización</Label>
              <Input id="organization" name="organization" placeholder="Organización" defaultValue={currentBusiness?.organizations} />
            </div>
            <Button type="submit" className="w-full">{currentBusiness ? 'Guardar cambios' : 'Crear negocio'}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este empredimiento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el empredimiento y eliminará los datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
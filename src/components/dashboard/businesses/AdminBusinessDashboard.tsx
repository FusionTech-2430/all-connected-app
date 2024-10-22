'use client'

import { useState } from 'react'
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

interface businessredimiento {
  id: string
  abbreviation: string
  name: string
  category: string
  description: string
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

interface businessredimientosManagementProps {
  businesses: Business[]
}

export default function businessredimientosManagement({ businesses }: businessredimientosManagementProps) {
  const [businessredimientos, setbusinessredimientos] = useState<businessredimiento[]>([
    { id: '1', abbreviation: 'PG', name: 'Pontioomitas', category: 'Category 1', description: 'Description 1' },
    { id: '2', abbreviation: 'DP', name: 'Danicostres', category: 'Category 2', description: 'Description 2' },
    { id: '3', abbreviation: 'PA', name: 'GolocinasPA1TO', category: 'Category 3', description: 'Description 3' },
    { id: '4', abbreviation: 'PC', name: 'PromotoresCuerna', category: 'Category 4', description: 'Description 4' },
    { id: '5', abbreviation: 'DC', name: 'DondeCris', category: 'Category 5', description: 'Description 5' },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentbusinessredimiento, setCurrentbusinessredimiento] = useState<businessredimiento | null>(null)

  const handleOpenDialog = (business: Business | null = null) => {
    // setCurrentbusinessredimiento(business)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCurrentbusinessredimiento(null)
    setIsDialogOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newbusinessredimiento: businessredimiento = {
      id: currentbusinessredimiento?.id || String(businessredimientos.length + 1),
      abbreviation: formData.get('name')?.toString().substring(0, 2).toUpperCase() || '',
      name: formData.get('name')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      description: formData.get('description')?.toString() || '',
    }

    if (currentbusinessredimiento) {
      setbusinessredimientos(businessredimientos.map(business => business.id === currentbusinessredimiento.id ? newbusinessredimiento : business))
    } else {
      setbusinessredimientos([...businessredimientos, newbusinessredimiento])
    }

    handleCloseDialog()
  }

  const handleDelete = (business: Business) => {
    // setCurrentbusinessredimiento(business)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentbusinessredimiento) {
      setbusinessredimientos(businessredimientos.filter(business => business.id !== currentbusinessredimiento.id))
      setCurrentbusinessredimiento(null)
    }
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.map((business) => (
            <TableRow key={business.id_business}>
              <TableCell>
                <div className="flex items-center">
                  {business.name}
                </div>
              </TableCell>
              <TableCell>{business.owner_id}</TableCell>
              <TableCell title={business.owner_id}>{truncateText(business.owner_id, 30)}</TableCell>
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
        <p className="text-sm text-gray-500">Total: {businessredimientos.length} emprendimientos.</p>
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
              {currentbusinessredimiento ? 'Editar businessredimiento' : 'Crea un nuevo businessredimiento'}
              <Button variant="ghost" size="icon" onClick={handleCloseDialog}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              {currentbusinessredimiento ? 'Modifica la información del businessredimiento' : 'Llena el formulario con la información del businessredimiento'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Nombre del gasto" defaultValue={currentbusinessredimiento?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" name="category" placeholder="Nombre de la categoría" defaultValue={currentbusinessredimiento?.category} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" placeholder="Breve descripción del businessredimiento" defaultValue={currentbusinessredimiento?.description} />
            </div>
            <Button type="submit" className="w-full">{currentbusinessredimiento ? 'Guardar cambios' : 'Crear businessredimiento'}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este businessredimiento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el businessredimiento y eliminará los datos de nuestros servidores.
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
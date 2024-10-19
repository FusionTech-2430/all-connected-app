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

interface Empredimiento {
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

export default function EmpredimientosManagement() {
  const [empredimientos, setEmpredimientos] = useState<Empredimiento[]>([
    { id: '1', abbreviation: 'PG', name: 'Pontioomitas', category: 'Category 1', description: 'Description 1' },
    { id: '2', abbreviation: 'DP', name: 'Danicostres', category: 'Category 2', description: 'Description 2' },
    { id: '3', abbreviation: 'PA', name: 'GolocinasPA1TO', category: 'Category 3', description: 'Description 3' },
    { id: '4', abbreviation: 'PC', name: 'PromotoresCuerna', category: 'Category 4', description: 'Description 4' },
    { id: '5', abbreviation: 'DC', name: 'DondeCris', category: 'Category 5', description: 'Description 5' },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentEmpredimiento, setCurrentEmpredimiento] = useState<Empredimiento | null>(null)

  const handleOpenDialog = (emp: Empredimiento | null = null) => {
    setCurrentEmpredimiento(emp)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCurrentEmpredimiento(null)
    setIsDialogOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newEmpredimiento: Empredimiento = {
      id: currentEmpredimiento?.id || String(empredimientos.length + 1),
      abbreviation: formData.get('name')?.toString().substring(0, 2).toUpperCase() || '',
      name: formData.get('name')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      description: formData.get('description')?.toString() || '',
    }

    if (currentEmpredimiento) {
      setEmpredimientos(empredimientos.map(emp => emp.id === currentEmpredimiento.id ? newEmpredimiento : emp))
    } else {
      setEmpredimientos([...empredimientos, newEmpredimiento])
    }

    handleCloseDialog()
  }

  const handleDelete = (emp: Empredimiento) => {
    setCurrentEmpredimiento(emp)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentEmpredimiento) {
      setEmpredimientos(empredimientos.filter(emp => emp.id !== currentEmpredimiento.id))
      setCurrentEmpredimiento(null)
    }
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de empredimientos</h1>
      <div className="flex justify-between mb-4">
        <Input className="w-1/3" placeholder="Buscar por nombre..." />
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {/* Add more categories as needed */}
            </SelectContent>
          </Select>
          <Button onClick={() => handleOpenDialog()}>Añadir</Button>
        </div>
      </div>
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
          {empredimientos.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>
                <div className="flex items-center">
                  <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    {emp.abbreviation}
                  </span>
                  {emp.name}
                </div>
              </TableCell>
              <TableCell>{emp.category}</TableCell>
              <TableCell title={emp.description}>{truncateText(emp.description, 30)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleOpenDialog(emp)}>
                      <Pencil className="mr-2 h-4 w-4 text-yellow-500" />
                      Modificar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleDelete(emp)}>
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
        <p className="text-sm text-gray-500">Total: {empredimientos.length} empredimientos.</p>
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
              {currentEmpredimiento ? 'Editar empredimiento' : 'Crea un nuevo empredimiento'}
              <Button variant="ghost" size="icon" onClick={handleCloseDialog}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              {currentEmpredimiento ? 'Modifica la información del empredimiento' : 'Llena el formulario con la información del empredimiento'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Nombre del gasto" defaultValue={currentEmpredimiento?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" name="category" placeholder="Nombre de la categoría" defaultValue={currentEmpredimiento?.category} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" placeholder="Breve descripción del empredimiento" defaultValue={currentEmpredimiento?.description} />
            </div>
            <Button type="submit" className="w-full">{currentEmpredimiento ? 'Guardar cambios' : 'Crear empredimiento'}</Button>
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
    </div>
  )
}
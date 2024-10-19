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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react"

interface Item {
  id: string
  name: string
  category: string
  price: number
  date: string
  type: 'expense' | 'income'
}

interface AdminSpecificEventDashboardProps {
  id: number
}

export default function AdminSpecificEventDashboard({ id }: AdminSpecificEventDashboardProps) {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Tutoría física', category: 'Educación', price: 42000, date: '10/02/2024', type: 'expense' },
    { id: '2', name: 'Tutoría matemáticas', category: 'Tecnología', price: 450000, date: '16/03/2024', type: 'expense' },
    { id: '3', name: 'Serenata', category: 'Entretenimiento', price: 32000, date: '22/03/2024', type: 'income' },
    { id: '4', name: 'Brownies', category: 'Alimento', price: 600000, date: '1/04/2024', type: 'income' },
    { id: '5', name: 'Galletas', category: 'Viaje', price: 2500000, date: '12/04/2024', type: 'expense' },
  ])
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<Item | null>(null)

  const filteredItems = items.filter(item => item.type === activeTab)
  const totalExpenses = items.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.price, 0)
  const totalIncome = items.filter(item => item.type === 'income').reduce((sum, item) => sum + item.price, 0)

  const handleOpenDialog = (item: Item | null = null) => {
    setCurrentItem(item)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCurrentItem(null)
    setIsDialogOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newItem: Item = {
      id: currentItem?.id || String(items.length + 1),
      name: formData.get('name')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      price: Number(formData.get('price')) || 0,
      date: formData.get('date')?.toString() || '',
      type: activeTab,
    }

    if (currentItem) {
      setItems(items.map(item => item.id === currentItem.id ? newItem : item))
    } else {
      setItems([...items, newItem])
    }

    handleCloseDialog()
  }

  const handleDelete = (item: Item) => {
    setCurrentItem(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentItem) {
      setItems(items.filter(item => item.id !== currentItem.id))
      setCurrentItem(null)
    }
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feria Emprende Creativo - Event ID: {id}</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos totales</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde el último mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos totales</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +19% desde el último mes
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'expense' | 'income')}>
        <TabsList>
          <TabsTrigger value="expense">Gastos</TabsTrigger>
          <TabsTrigger value="income">Ingresos</TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <div className="flex justify-between mb-4">
            <Input className="w-1/3" placeholder="Buscar por nombre..." />
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Añadir
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(item)}>
                          <Pencil className="mr-2 h-4 w-4 text-yellow-500" /> {/* Change color to yellow */}
                          Modificar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item)}>
                          <Trash2 className="mr-2 h-4 w-4 text-red-500" /> {/* Change color to red */}
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="income">
          <div className="flex justify-between mb-4">
            <Input className="w-1/3" placeholder="Buscar por nombre..." />
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Añadir
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(item)}>
                          <Pencil className="mr-2 h-4 w-4 text-yellow-500" /> {/* Change color to yellow */}
                          Modificar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item)}>
                          <Trash2 className="mr-2 h-4 w-4 text-red-500" /> {/* Change color to red */}
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">Total: {filteredItems.length} items.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">&lt;&lt;</Button>
          <Button variant="outline" size="sm">&lt;</Button>
          <span className="text-sm">Página 1 de 10</span>
          <Button variant="outline" size="sm">&gt;</Button>
          <Button variant="outline" size="sm">&gt;&gt;</Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {currentItem ? `Editar ${activeTab === 'expense' ? 'gasto' : 'ingreso'}` : `Crear nuevo ${activeTab === 'expense' ? 'gasto' : 'ingreso'}`}
            </DialogTitle>
            <DialogDescription>
              {currentItem ? `Modifica la información del ${activeTab === 'expense' ? 'gasto' : 'ingreso'}` : `Ingresa la información del nuevo ${activeTab === 'expense' ? 'gasto' : 'ingreso'}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" defaultValue={currentItem?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" name="category" defaultValue={currentItem?.category} required />
            </div>
            <div className="space-y-2">
              <Label  htmlFor="price">Precio</Label>
              <Input id="price" name="price" type="number" defaultValue={currentItem?.price} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" defaultValue={currentItem?.date} required />
            </div>
            <Button type="submit" className="w-full">{currentItem ? 'Guardar cambios' : `Crear ${activeTab === 'expense' ? 'gasto' : 'ingreso'}`}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este {activeTab === 'expense' ? 'gasto' : 'ingreso'}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el {activeTab === 'expense' ? 'gasto' : 'ingreso'} y todos los datos asociados.
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
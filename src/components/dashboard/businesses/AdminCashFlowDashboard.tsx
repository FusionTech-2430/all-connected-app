'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'

interface Item {
  id: number
  eventoId: number
  nombre: string
  categoria: string
  precio: number
  fecha: string
}

interface AdminCashFlowDashboardProps {
  id: number
}

export default function AdminCashFlowDashboard({
  id
}: AdminCashFlowDashboardProps) {
  const [items, setItems] = useState<Item[]>([])
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<Item | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    fetchItems()
    fetchTotals()
  }, [id, activeTab])

  const fetchItems = async () => {
    try {
      const response = await fetch(
        `https://mockserverflowevents-production.up.railway.app/api/v1/eventos-flujo/${id}/${activeTab === 'expense' ? 'gastos' : 'ingresos'}`
      )
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error)
    }
  }

  const fetchTotals = async () => {
    try {
      const expensesResponse = await fetch(
        `https://mockserverflowevents-production.up.railway.app/api/v1/eventos-flujo/${id}/gastos-totales`
      )
      const expensesTotal = await expensesResponse.json()
      setTotalExpenses(expensesTotal.total || 0)

      const incomeResponse = await fetch(
        `https://mockserverflowevents-production.up.railway.app/api/v1/eventos-flujo/${id}/ingresos-totales`
      )
      const incomeTotal = await incomeResponse.json()
      setTotalIncome(incomeTotal.total || 0)
    } catch (error) {
      console.error('Error fetching totals:', error)
    }
  }

  const filteredItems = items.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleOpenDialog = (item: Item | null = null) => {
    setCurrentItem(item)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCurrentItem(null)
    setIsDialogOpen(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newItem = {
      eventoId: Number(id),
      nombre: formData.get('name')?.toString() || '',
      categoria: formData.get('category')?.toString() || '',
      precio: parseFloat(formData.get('price')?.toString() || '0'),
      fecha: formData.get('date')?.toString() || ''
    }

    console.log('Submitting new item:', newItem)

    try {
      if (currentItem) {
        // Update existing item
        await fetch(
          `https://mockserverflowevents-production.up.railway.app/api/v1/${activeTab === 'expense' ? 'gastos' : 'ingresos'}/${currentItem.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
          }
        )
      } else {
        // Create new item
        await fetch(
          `https://mockserverflowevents-production.up.railway.app/api/v1/${activeTab === 'expense' ? 'gastos' : 'ingresos'}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
          }
        )
      }
      fetchItems()
      fetchTotals()
      handleCloseDialog()
    } catch (error) {
      console.error(`Error saving ${activeTab}:`, error)
    }
  }

  const handleDelete = (item: Item) => {
    setCurrentItem(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (currentItem) {
      try {
        await fetch(
          `https://mockserverflowevents-production.up.railway.app/api/v1/${activeTab === 'expense' ? 'gastos' : 'ingresos'}/${currentItem.id}`,
          {
            method: 'DELETE'
          }
        )
        fetchItems()
        fetchTotals()
      } catch (error) {
        console.error(`Error deleting ${activeTab}:`, error)
      }
    }
    setIsDeleteDialogOpen(false)
    setCurrentItem(null)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flujo de Caja</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gastos totales
            </CardTitle>
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
            <div className="text-2xl font-bold">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos totales
            </CardTitle>
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
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'expense' | 'income')}
      >
        <TabsList>
          <TabsTrigger value="expense">Gastos</TabsTrigger>
          <TabsTrigger value="income">Ingresos</TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <div className="flex justify-between mb-4">
            <Input
              className="w-1/3"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              {paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>${item.precio.toFixed(2)}</TableCell>
                  <TableCell>{item.fecha}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Pencil className="mr-2 h-4 w-4 text-yellow-500" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item)}>
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
        </TabsContent>
        <TabsContent value="income">
          <div className="flex justify-between mb-4">
            <Input
              className="w-1/3"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              {paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>${item.precio.toFixed(2)}</TableCell>
                  <TableCell>{item.fecha}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Pencil className="mr-2 h-4 w-4 text-yellow-500" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item)}>
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
        </TabsContent>
      </Tabs>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredItems.length)} de{' '}
          {filteredItems.length} items.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          <span className="text-sm py-2">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {currentItem
                ? `Editar ${activeTab === 'expense' ? 'gasto' : 'ingreso'}`
                : `Crear nuevo ${
                    activeTab === 'expense' ? 'gasto' : 'ingreso'
                  }`}
            </DialogTitle>
            <DialogDescription>
              {currentItem
                ? `Modifica la información del ${
                    activeTab === 'expense' ? 'gasto' : 'ingreso'
                  }`
                : `Ingresa la información del nuevo ${
                    activeTab === 'expense' ? 'gasto' : 'ingreso'
                  }`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                defaultValue={currentItem?.nombre}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                name="category"
                defaultValue={currentItem?.categoria}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={currentItem?.precio}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={currentItem?.fecha}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {currentItem
                ? 'Guardar cambios'
                : `Crear ${activeTab === 'expense' ? 'gasto' : 'ingreso'}`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres eliminar este{' '}
              {activeTab === 'expense' ? 'gasto' : 'ingreso'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el {activeTab === 'expense' ? 'gasto' : 'ingreso'} y todos los
              datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
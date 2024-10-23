'use client'

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Search, Eye, Trash2, X } from 'lucide-react'

type Product = {
  id: string
  name: string
  user: string
  reason: string
  date: string
  category: 'productos' | 'servicios'
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Choco galletas', user: 'Carlos Rojas', reason: 'Las Galletas parece que... aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', date: '10/02/2024', category: 'productos' },
    { id: '2', name: 'Brownies de arequipe', user: 'Camilo Nossa', reason: 'El arequipe de baja calidad...', date: '16/03/2024', category: 'productos' },
    { id: '3', name: 'Vapes', user: 'Steven Ortiz', reason: 'Producto sin supervisión...', date: '22/03/2024', category: 'productos' },
    { id: '4', name: 'Diseño de logo', user: 'Carlos Rojas', reason: 'Varios stickers parecen...', date: '1/04/2024', category: 'servicios' },
    { id: '5', name: 'Consultoría', user: 'Carlos Rojas', reason: 'Algunas operaciones muestran...', date: '12/04/2024', category: 'servicios' },
  ])

  const [deletedProducts, setDeletedProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'productos' | 'servicios'>('todos')
  const [deletedSelectedCategory, setDeletedSelectedCategory] = useState<'todos' | 'productos' | 'servicios'>('todos')

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }

  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id))
      setDeletedProducts([...deletedProducts, selectedProduct])
      setIsDeleteDialogOpen(false)
    }
  }

  const filteredProducts = products.filter(product => 
    selectedCategory === 'todos' || product.category === selectedCategory
  )

  const filteredDeletedProducts = deletedProducts.filter(product => 
    deletedSelectedCategory === 'todos' || product.category === deletedSelectedCategory
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Gestión reportes de productos y servicios</h2>
        <div className="mb-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre..." className="pl-8" />
        </div>
        <div className="mb-4 flex space-x-2">
          <Button 
            variant={selectedCategory === 'todos' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('todos')}
          >
            Todos
          </Button>
          <Button 
            variant={selectedCategory === 'productos' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('productos')}
          >
            Productos
          </Button>
          <Button 
            variant={selectedCategory === 'servicios' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('servicios')}
          >
            Servicios
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.user}</TableCell>
                <TableCell title={product.reason}>{truncateText(product.reason, 30)}</TableCell>
                <TableCell>{product.date}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(product)}>
                        <Eye className="mr-2 h-4 w-4 text-blue-500" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product)}>
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
        <div className="flex items-center justify-between mt-4">
          <div>Total: {filteredProducts.length} eventos</div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">&lt;&lt;</Button>
            <Button variant="outline" size="sm">&lt;</Button>
            <div>Página 1 de 10</div>
            <Button variant="outline" size="sm">&gt;</Button>
            <Button variant="outline" size="sm">&gt;&gt;</Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Historial de productos y servicios eliminados</h2>
        <div className="mb-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre..." className="pl-8" />
        </div>
        <div className="mb-4 flex space-x-2">
          <Button 
            variant={deletedSelectedCategory === 'todos' ? 'default' : 'outline'}
            onClick={() => setDeletedSelectedCategory('todos')}
          >
            Todos
          </Button>
          <Button 
            variant={deletedSelectedCategory === 'productos' ? 'default' : 'outline'}
            onClick={() => setDeletedSelectedCategory('productos')}
          >
            Productos
          </Button>
          <Button 
            variant={deletedSelectedCategory === 'servicios' ? 'default' : 'outline'}
            onClick={() => setDeletedSelectedCategory('servicios')}
          >
            Servicios
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeletedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.user}</TableCell>
                <TableCell title={product.reason}>{truncateText(product.reason, 30)}</TableCell>
                <TableCell>{product.date}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleView(product)}>
                    <Eye className="mr-2 h-4 w-4 text-blue-500" />
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <div>Total: {filteredDeletedProducts.length} eventos eliminados</div>
        </div>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Visualizar producto
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-4">
            Información del producto
          </div>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={selectedProduct.name}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user" className="text-right">
                  Usuario
                </Label>
                <Input
                  id="user"
                  value={selectedProduct.user}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Motivo
                </Label>
                <Textarea
                  id="reason"
                  value={selectedProduct.reason}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Fecha
                </Label>
                <Input
                  id="date"
                  value={selectedProduct.date}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoría
                </Label>
                <Input
                  id="category"
                  value={selectedProduct.category}
                  readOnly
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)} className="w-full">Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Está seguro de que desea eliminar este producto?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
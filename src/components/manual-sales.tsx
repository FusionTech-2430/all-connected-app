'use client'

import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ChevronUp, ChevronDown } from 'lucide-react'

interface Venta {
  id: number;
  cliente: string;
  producto: string;
  cantidad: number;
  precio: number;
  fecha: string;
}

const ventasIniciales: Venta[] = [
  { id: 1, cliente: "Juan Pérez", producto: "Brownie de chocolate", cantidad: 2, precio: 8000, fecha: "2024-05-01" },
  { id: 2, cliente: "María Rodríguez", producto: "Galleta de limón", cantidad: 5, precio: 20000, fecha: "2024-05-01" },
  { id: 3, cliente: "Pedro Torres", producto: "Brownie de arequipe", cantidad: 1, precio: 4000, fecha: "2024-05-12" },
  { id: 4, cliente: "Julián García", producto: "Galleta Rebelvet", cantidad: 2, precio: 8000, fecha: "2024-05-01" },
]

const formatearPrecio = (precio: number) => {
  return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatearFecha = (fecha: string) => {
  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

const esFechaValida = (fecha: string) => {
  const fechaVenta = new Date(fecha)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0) // Resetear la hora a medianoche para comparar solo las fechas
  return fechaVenta <= hoy
}

type ClavesOrdenamiento = keyof Omit<Venta, 'id'>
type DireccionOrdenamiento = 'asc' | 'desc'

export default function VentasManuales() {
  const [ventas, setVentas] = useState<Venta[]>(ventasIniciales)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nuevaVenta, setNuevaVenta] = useState<Omit<Venta, 'id'>>({
    cliente: '',
    producto: '',
    cantidad: 0,
    precio: 0,
    fecha: new Date().toISOString().split('T')[0]
  })
  const [errores, setErrores] = useState<Partial<Record<keyof Venta, string>>>({})
  const [notificacion, setNotificacion] = useState<string | null>(null)
  const [configuracionOrden, setConfiguracionOrden] = useState<{ clave: ClavesOrdenamiento; direccion: DireccionOrdenamiento }>({ clave: 'cliente', direccion: 'asc' })

  const ventasOrdenadas = useMemo(() => {
    const ventasOrdenables = [...ventas]
    if (configuracionOrden.clave) {
      ventasOrdenables.sort((a, b) => {
        if (a[configuracionOrden.clave] < b[configuracionOrden.clave]) {
          return configuracionOrden.direccion === 'asc' ? -1 : 1
        }
        if (a[configuracionOrden.clave] > b[configuracionOrden.clave]) {
          return configuracionOrden.direccion === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return ventasOrdenables
  }, [ventas, configuracionOrden])

  const solicitarOrdenamiento = (clave: ClavesOrdenamiento) => {
    let direccion: DireccionOrdenamiento = 'asc'
    if (configuracionOrden.clave === clave && configuracionOrden.direccion === 'asc') {
      direccion = 'desc'
    }
    setConfiguracionOrden({ clave, direccion })
  }

  const validarFormulario = () => {
    const nuevosErrores: Partial<Record<keyof Venta, string>> = {}
    if (!nuevaVenta.cliente) nuevosErrores.cliente = "El nombre del cliente es obligatorio"
    if (!nuevaVenta.producto) nuevosErrores.producto = "El nombre del producto es obligatorio"
    if (!nuevaVenta.cantidad || nuevaVenta.cantidad <= 0) nuevosErrores.cantidad = "La cantidad debe ser mayor a 0"
    if (!nuevaVenta.precio || nuevaVenta.precio <= 0) nuevosErrores.precio = "El precio debe ser mayor a 0"
    if (!nuevaVenta.fecha) {
      nuevosErrores.fecha = "La fecha es obligatoria"
    } else if (!esFechaValida(nuevaVenta.fecha)) {
      nuevosErrores.fecha = "La fecha no puede ser posterior al día actual"
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarCambioInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNuevaVenta(prev => ({ ...prev, [name]: name === 'cantidad' || name === 'precio' ? Number(value) : value }))
  }

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    if (validarFormulario()) {
      const id = ventas.length > 0 ? Math.max(...ventas.map(v => v.id)) + 1 : 1
      setVentas([...ventas, { id, ...nuevaVenta }])
      setModalAbierto(false)
      setNuevaVenta({
        cliente: '',
        producto: '',
        cantidad: 0,
        precio: 0,
        fecha: new Date().toISOString().split('T')[0]
      })
      setNotificacion("Venta registrada exitosamente")
      setTimeout(() => setNotificacion(null), 3000)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Ventas Manuales</h1>
      <Button onClick={() => setModalAbierto(true)} className="mb-6">
        Agregar venta
      </Button>

      {notificacion && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{notificacion}</span>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {([
              { key: 'cliente', label: 'Cliente' },
              { key: 'producto', label: 'Producto' },
              { key: 'cantidad', label: 'Cantidad' },
              { key: 'precio', label: 'Precio' },
              { key: 'fecha', label: 'Fecha' }
            ] as const).map(({ key, label }) => (
              <TableHead key={key} className="cursor-pointer" onClick={() => solicitarOrdenamiento(key)}>
                <div className="flex items-center">
                  {label}
                  {configuracionOrden.clave === key && (
                    configuracionOrden.direccion === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventasOrdenadas.map((venta) => (
            <TableRow key={venta.id}>
              <TableCell>{venta.cliente}</TableCell>
              <TableCell>{venta.producto}</TableCell>
              <TableCell>{venta.cantidad}</TableCell>
              <TableCell>${formatearPrecio(venta.precio)}</TableCell>
              <TableCell>{formatearFecha(venta.fecha)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Venta</DialogTitle>
          </DialogHeader>
          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                name="cliente"
                value={nuevaVenta.cliente}
                onChange={manejarCambioInput}
                placeholder="Nombre del cliente"
              />
              {errores.cliente && <p className="text-red-500 text-sm">{errores.cliente}</p>}
            </div>
            <div>
              <Label htmlFor="producto">Producto</Label>
              <Input
                id="producto"
                name="producto"
                value={nuevaVenta.producto}
                onChange={manejarCambioInput}
                placeholder="Nombre del producto"
              />
              {errores.producto && <p className="text-red-500 text-sm">{errores.producto}</p>}
            </div>
            <div>
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                name="cantidad"
                type="number"
                value={nuevaVenta.cantidad || ''}
                onChange={manejarCambioInput}
                placeholder="Cantidad"
              />
              {errores.cantidad && <p className="text-red-500 text-sm">{errores.cantidad}</p>}
            </div>
            <div>
              <Label htmlFor="precio">Precio por unidad</Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                value={nuevaVenta.precio || ''}
                onChange={manejarCambioInput}
                placeholder="Precio por unidad"
              />
              {errores.precio && <p className="text-red-500 text-sm">{errores.precio}</p>}
            </div>
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                value={nuevaVenta.fecha}
                onChange={manejarCambioInput}
                max={new Date().toISOString().split('T')[0]}
              />
              {errores.fecha && <p className="text-red-500 text-sm">{errores.fecha}</p>}
            </div>
            <DialogFooter>
              <Button type="submit">Guardar venta</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
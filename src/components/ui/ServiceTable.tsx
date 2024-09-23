import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { MoreHorizontal } from "lucide-react"
  import { Button } from "@/components/ui/button"
  
  interface Service {
    nombre: string
    categoria: string
    solicitudes: number
  }
  
  const services: Service[] = [
    { nombre: "Tutorias de matematicas", categoria: "Educación", solicitudes: 8 },
    { nombre: "Tutorias de fisica", categoria: "Educación", solicitudes: 2 },
    { nombre: "Mantenimiento de PCs", categoria: "Ingeniería", solicitudes: 6 },
    { nombre: "Diseño de logos", categoria: "Diseño", solicitudes: 25 },
    { nombre: "Serenata", categoria: "Música", solicitudes: 1 },
  ]
  
  export default function ServiceTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Solicitudes</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.nombre}>
              <TableCell className="font-medium">{service.nombre}</TableCell>
              <TableCell>{service.categoria}</TableCell>
              <TableCell>{service.solicitudes}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Acciones</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
// src/components/MessagesList.tsx

"use client"; 
import { Bell, ChevronRight, LayoutDashboard, MessageSquare, PlusCircle, ShoppingCart, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface Message {
  id: number;
  client: string;
  date: string;
}

const menuItems: MenuItem[] = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "Inventario" },
  { icon: <PlusCircle className="w-4 h-4" />, label: "Flujo de Caja" },
  { icon: <ShoppingCart className="w-4 h-4" />, label: "Mi emprendimiento" },
  { icon: <MessageSquare className="w-4 h-4" />, label: "Mensajes", active: true },
  { icon: <PlusCircle className="w-4 h-4" />, label: "Registro Manual Ventas" },
]

const messages: Message[] = [
  { id: 1, client: "Esteban Salazar", date: "2024-05-01" },
  { id: 2, client: "Victor Joel Vazquez", date: "2024-06-10" },
  { id: 3, client: "Alejandra Romero", date: "2024-08-03" },
]

export default function Component() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8 bg-blue-500">
              <AvatarImage src="/logo.png" alt="AllConnected Logo" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-blue-500">AllConnected</span>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-2 p-2 rounded ${item.active ? 'bg-blue-50 text-blue-500' : 'text-gray-600'}`}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center border-b">
          <div className="flex items-center space-x-4 md:hidden">
            <Avatar className="w-8 h-8 bg-blue-500">
              <AvatarImage src="/logo.png" alt="AllConnected Logo" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-blue-500">AllConnected</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-blue-500 hidden md:inline-flex">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Mejora tu membresía
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Mensajes Recibidos</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-2">Ver mensajes</h2>
              <p className="text-sm text-gray-500 mb-4">Aquí se muestran todos los mensajes de tus clientes</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.client}</TableCell>
                      <TableCell>{message.date}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white p-4 text-center text-sm text-gray-500">
          © 2024 AllConnected. Todos los derechos reservados by FusionTech
        </footer>
      </div>
    </div>
  );
}
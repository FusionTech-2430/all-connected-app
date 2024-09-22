"use client";
import { Bell, User, Send } from "lucide-react"
import Link from "next/link"

const messages = [
  { id: 1, name: "Esteban Salazar", date: "2024-05-01" },
  { id: 2, name: "Victor Joel Vasquez", date: "2024-06-10" },
  { id: 3, name: "Alejandra Romero", date: "2024-08-03" },
]

export default function MessageList() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900">
      <aside className="w-full md:w-64 bg-gray-800 p-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
            <span className="text-xl">A</span>
          </div>
          <span className="text-xl font-semibold text-white">AllConnected</span>
        </div>
        <nav>
          <Link href="#" className="block py-2 text-gray-300 hover:bg-gray-700 rounded px-2">Inventario</Link>
          <Link href="#" className="block py-2 text-gray-300 hover:bg-gray-700 rounded px-2">Flujo de Caja</Link>
          <Link href="#" className="block py-2 text-gray-300 hover:bg-gray-700 rounded px-2">Mi emprendimiento</Link>
          <Link href="#" className="block py-2 text-blue-500 bg-blue-900 rounded px-2">Mensajes</Link>
          <Link href="#" className="block py-2 text-gray-300 hover:bg-gray-700 rounded px-2">Registro Manual Ventas</Link>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Mensajes Recibidos</h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Mejora tu membresia
            </button>
            <Bell className="text-gray-300" />
            <User className="text-gray-300" />
          </div>
        </header>
        <div className="flex-1 p-6 bg-gray-900">
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Ver mensajes</h2>
            <p className="text-gray-400 mb-4">Aquí se muestran todos los mensajes de tus clientes.</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-white">Cliente</th>
                    <th className="text-left py-2 text-white">Fecha</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id} className="border-b border-gray-700">
                      <td className="py-2 text-white">{message.name}</td>
                      <td className="py-2 text-white">{message.date}</td>
                      <td className="py-2 text-right">
                        <Link href={`/messages?id=${message.id}`}>
                          <Send className="inline-block text-blue-500" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
// src/components/Chat.tsx
"use client";
import { useState } from 'react'
import { Bell, ChevronLeft, Paperclip, Send, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number;
  content: string;
  timestamp: string;
  isUser: boolean;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: <div className="w-4 h-4 border border-gray-400 rounded-sm" />, label: "Inventario" },
  { icon: <div className="w-4 h-4 border border-gray-400 rounded-sm" />, label: "Flujo de Caja" },
  { icon: <div className="w-4 h-4 border border-gray-400 rounded-sm" />, label: "Mi emprendimiento" },
  { icon: <div className="w-4 h-4 border border-gray-400 rounded-sm" />, label: "Mensajes", active: true },
  { icon: <div className="w-4 h-4 border border-gray-400 rounded-sm" />, label: "Registro Manual Ventas" },
]

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Hola, me gustaría comentarte un problema.", timestamp: "15:00 AM", isUser: true },
    { id: 2, content: "Sí claro, coméntame en qué te podemos ayudar.", timestamp: "15:03 AM", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg: Message = {
        id: messages.length + 1,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>Volver a mensajes</span>
          </div>
          <div className="flex items-center space-x-4">
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

        {/* Chat Area */}
        <div className="flex-1 p-4 bg-gray-100">
          <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
            <div className="border-b pb-2 mb-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>ES</AvatarFallback>
                </Avatar>
                <span className="font-semibold">Esteban Salazar</span>
              </div>
            </div>
            <ScrollArea className="flex-1 pr-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`max-w-[70%] ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
                    <p>{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="border-t pt-4 mt-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white p-2 text-center text-sm text-gray-500">
          © 2024 AllConnected. Todos los derechos reservados by FusionTech
        </footer>
      </div>
    </div>
  );
}
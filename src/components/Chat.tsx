'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, User, Send, Paperclip, ArrowLeft, File, X } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'client';
  time: string;
  file?: {
    name: string;
    url: string;
    type: 'image' | 'document';
  };
}

type ChatData = {
  [key: string]: {
    name: string;
    messages: Message[];
  };
}

const chatData: ChatData = {
  '1': {
    name: "Esteban Salazar",
    messages: [
      { id: 1, text: "Hola, me gustaría comentarte un problema", sender: "client", time: "15:30 PM" },
      { id: 2, text: "Si claro, comentame en que te podemos ayudar", sender: "user", time: "15:35 PM" },
    ]
  },
  '2': {
    name: "Victor Joel Vasquez",
    messages: [
      { id: 1, text: "Buenas tardes, tengo una consulta sobre mi pedido", sender: "client", time: "14:00 PM" },
      { id: 2, text: "Hola, con gusto te ayudo. ¿Cuál es tu número de pedido?", sender: "user", time: "14:05 PM" },
    ]
  },
  '3': {
    name: "Alejandra Romero",
    messages: [
      { id: 1, text: "Hola, ¿tienen disponible el producto XYZ?", sender: "client", time: "10:15 AM" },
      { id: 2, text: "Buenos días, déjame verificar el inventario", sender: "user", time: "10:20 AM" },
    ]
  },
}

function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-4 flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
            <X className="h-6 w-6" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [chatName, setChatName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [modalImage, setModalImage] = useState<string | null>(null)

  useEffect(() => {
    if (id && chatData[id]) {
      setMessages(chatData[id].messages)
      setChatName(chatData[id].name)
    }
  }, [id])

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const isImage = file.type.startsWith('image/')
      const newMessage: Message = {
        id: messages.length + 1,
        text: isImage ? '' : `File: ${file.name}`,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        file: {
          name: file.name,
          url: URL.createObjectURL(file),
          type: isImage ? 'image' : 'document'
        }
      }
      setMessages([...messages, newMessage])
    }
  }

  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 p-6 shadow-md">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
            <span className="text-xl">A</span>
          </div>
          <span className="text-xl font-semibold dark:text-white">AllConnected</span>
        </div>
        <nav>
          <Link href="#" className="block py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2">Inventario</Link>
          <Link href="#" className="block py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2">Flujo de Caja</Link>
          <Link href="#" className="block py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2">Mi emprendimiento</Link>
          <Link href="#" className="block py-2 text-blue-500 bg-blue-100 dark:bg-blue-900 rounded px-2">Mensajes</Link>
          <Link href="#" className="block py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2">Registro Manual Ventas</Link>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/greet" className="text-blue-500 flex items-center">
              <ArrowLeft className="mr-2" />
              Volver a mensajes
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Mejora tu membresia
            </button>
            <Bell className="text-gray-600 dark:text-gray-300" />
            <User className="text-gray-600 dark:text-gray-300" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-2 flex items-center justify-center">
                {chatName.charAt(0)}
              </div>
              <span className="font-semibold dark:text-white">{chatName}</span>
            </div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {message.file ? (
                    message.file.type === 'image' ? (
                      <Image 
                        src={message.file.url} 
                        alt="Uploaded image" 
                        width={200} 
                        height={200} 
                        className="rounded-lg cursor-pointer" 
                        onClick={() => handleImageClick(message.file!.url)}
                      />
                    ) : (
                      <a href={message.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <File className="mr-2" />
                        {message.file.name}
                      </a>
                    )
                  ) : (
                    message.text
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{message.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
          <div className="max-w-2xl mx-auto flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload file"
            />
            <button 
              className="bg-gray-200 dark:bg-gray-700 p-2 rounded-r-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              className="bg-blue-500 text-white p-2 rounded-lg ml-2 hover:bg-blue-600"
              onClick={handleSendMessage}
            >
              <Send />
            </button>
          </div>
        </div>
      </main>
      <Modal isOpen={!!modalImage} onClose={() => setModalImage(null)}>
        {modalImage && (
          <Image
            src={modalImage}
            alt="Enlarged image"
            width={800}
            height={600}
            className="max-w-full max-h-[80vh] object-contain"
          />
        )}
      </Modal>
    </div>
  )
}
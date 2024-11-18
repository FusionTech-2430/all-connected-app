'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, ArrowLeft, File, X } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  loadChatName,
  loadMessages,
  sendMessage,
  uploadFileAndSendMessage
} from '@/services/chatService'
import { Message } from '@/types/chat/Message'
import { useUserId } from '@/hooks/use-user-id'

// Modal Component Definition
function Modal({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

interface ChatProps {
  business: boolean;
}

export default function ChatInterface(prop : ChatProps) {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [chatName, setChatName] = useState('Cliente All Connected')
  const [currentUserId, setCurrentUserId] = useState<string>("")

  const userId = useUserId()

  useEffect(() => {
    let senderId = userId ? userId : ""
      if(prop.business === true){
        const sessionBusinessId = sessionStorage.getItem('currentBusinessId')
        senderId = sessionBusinessId ? sessionBusinessId : ""
      }
    setCurrentUserId(senderId)
  }, [userId, prop.business])

  useEffect(() => {
    if (id) {
      loadChatName(id, setChatName)
      loadMessages(id, setMessages)
    }
  }, [id])

  const handleSendMessage = () => {
    if (id && userId) {
      sendMessage(id, inputMessage, currentUserId)
      setInputMessage('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && id && userId) {
      uploadFileAndSendMessage(id, file, currentUserId, (error: string) =>
        console.error(error)
      )
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      <section className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href={prop.business ? "/messages" : "/consumer/messages"} className="text-blue-500 flex items-center">
              <ArrowLeft className="mr-2" />
              Volver a mensajes
            </Link>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-2 flex items-center justify-center">
                {chatName.charAt(0)}{' '}
                {/* Muestra la inicial del nombre del chat */}
              </div>
              <span className="font-semibold dark:text-white">{chatName}</span>{' '}
              {/* Muestra el nombre completo */}
            </div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === currentUserId ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === currentUserId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
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
                        onClick={() => setModalImage(message.file!.url)}
                      />
                    ) : (
                      <a
                        href={message.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <File className="mr-2" />
                        {message.file.name}
                      </a>
                    )
                  ) : (
                    message.text
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(message.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
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
                  handleSendMessage()
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
      </section>
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

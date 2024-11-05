'use client'
import { Send } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchUserChats } from '@/services/chatService'
import { Chat } from '@/types/chat/Message'
import { useUserId } from '@/hooks/use-user-id'

interface MessagesListProps {
  business: boolean;
}

const MessagesList = (prop : MessagesListProps) => {
  const [messages, setMessages] = useState<Chat[]>([])
  const router = useRouter()

  const userId = useUserId()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!userId) {
          router.push('/')
          return
        }
        let id : string | null = userId;
        if(prop.business === true){
          id = sessionStorage.getItem('currentBusinessId')
          if (!id) {
            router.push('/')
            return
          }
        }

        fetchUserChats(id, setMessages)
      } catch (error) {
        console.error('Error getting chats:', error)
      }
    }
    fetchMessages()
  }, [router, userId, prop.business])

  return (
    <section className="flex flex-col">
      <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 overflow-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Ver mensajes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Aquí se muestran todos los mensajes de tus clientes.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-600 dark:text-gray-300">
                    Cliente
                  </th>
                  <th className="text-left py-2 text-gray-600 dark:text-gray-300">
                    Fecha
                  </th>
                  <th className="py-2">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr
                    key={message.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-2 text-gray-900 dark:text-white">
                      {message.name}
                    </td>
                    <td className="py-2 text-gray-900 dark:text-white">
                      {message.date}
                    </td>
                    <td className="py-2 text-right">
                      <Link
                        href={prop.business? `/messages/chat?id=${message.id}` : `/consumer/messages/chat?id=${message.id}`}
                        className="inline-block text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <Send className="h-5 w-5" />
                        <span className="sr-only">
                          Ver mensaje de {message.name}
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MessagesList

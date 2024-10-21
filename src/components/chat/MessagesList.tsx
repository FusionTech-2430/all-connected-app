'use client'
import { Send } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { database } from '@/lib/firebase/config'
import { useRouter } from 'next/navigation'
import { formatFriendlyDate } from '@/utils/date-utils'

// Interfaz del mensaje
interface Message {
  id: string;
  name: string;
  date: string;
}

const MessagesList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (typeof window !== 'undefined') {
          const id_user = sessionStorage.getItem('id-user');
          if (!id_user) {
            router.push('/');
            return;
          }

          // Referencia a la colección 'chats'
          const chatsRef = ref(database, 'chats');
          
          // Escuchar cambios en la colección 'chats'
          onValue(chatsRef, (snapshot) => {
            const chatsData = snapshot.val();
            const userChats: Message[] = [];

            // Filtrar los chats donde el usuario actual está presente
            for (const chatId in chatsData) {
              const chat = chatsData[chatId];
              const usersInChat = chat.users;

              // Verificar si el usuario actual está en este chat
              if (Object.values(usersInChat).includes(id_user)) {
                const otherUserId = Object.values(usersInChat).find((uid) => uid !== id_user);
                const messages = chat.messages || {};
                const messageKeys = Object.keys(messages);

                let lastMessageDate = 'Sin mensajes';
                // Si hay mensajes en el chat
                if (messageKeys.length > 0) {
                  const lastMessageKey = messageKeys[messageKeys.length - 1];
                  const lastMessage = messages[lastMessageKey];
                  lastMessageDate = formatFriendlyDate(lastMessage.time); // Aplicar formato amigable a la fecha
                }

                userChats.push({
                  id: chatId,
                  name: typeof otherUserId === 'string' ? otherUserId : 'Desconocido',
                  date: lastMessageDate
                });
              }
            }

            setMessages(userChats);
          });
        }
      } catch (error) {
        console.error('Error getting chats:', error);
      }
    };
    fetchMessages();
  }, [router]);
  return (
    <>
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
                          href={`/chat?id=${message.id}`}
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
    </>
  );
}

export default MessagesList;

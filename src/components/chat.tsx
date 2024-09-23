'use client';

import { useState, useRef, useEffect } from 'react';
import { ref, push, onValue } from "firebase/database";
import { uploadBytesResumable, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { database, storage } from '@/services/firebase';
import { Bell, User, Send, Paperclip, ArrowLeft, File, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

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
};

// Modal Component Definition
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
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [chatName, setChatName] = useState('Cliente All Connected'); // Valor por defecto

  // Cargar nombre del chat desde Firebase o usar valor por defecto
  useEffect(() => {
    if (id) {
      const chatRef = ref(database, `chats/${id}/name`);
      onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setChatName(data);
        } else {
          setChatName('Cliente All Connected'); // Si no existe el nombre, mostrar predeterminado
        }
      });
    }
  }, [id]);

  // Cargar mensajes desde Firebase cuando el componente se monte
  useEffect(() => {
    if (id) {
      const chatRef = ref(database, `chats/${id}/messages`);
      onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const chatMessages = Object.values(data);
          setMessages(chatMessages as Message[]);
        }
      });
    }
  }, [id]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      };

      const chatRef = ref(database, `chats/${id}/messages`);
      push(chatRef, newMessage);
      setInputMessage('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileRef = storageRef(storage, `chats/${id}/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      // Inicia la subida del archivo
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Error al subir archivo:', error);
        },
        () => {
          // Obtener la URL de descarga cuando la subida se complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const isImage = file.type.startsWith('image/');
            const newMessage: Message = {
              id: Date.now(),
              text: isImage ? '' : `Archivo: ${file.name}`,
              sender: 'user',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
              file: {
                name: file.name,
                url: downloadURL,
                type: isImage ? 'image' : 'document',
              },
            };

            const chatRef = ref(database, `chats/${id}/messages`);
            push(chatRef, newMessage);
          });
        }
      );
    }
  };

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
      <section className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/messages" className="text-blue-500 flex items-center">
              <ArrowLeft className="mr-2" />
              Volver a mensajes
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Mejora tu membresía
            </button>
            <Bell className="text-gray-600 dark:text-gray-300" />
            <User className="text-gray-600 dark:text-gray-300" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-2 flex items-center justify-center">
                {chatName.charAt(0)} {/* Muestra la inicial del nombre del chat */}
              </div>
              <span className="font-semibold dark:text-white">{chatName}</span> {/* Muestra el nombre completo */}
            </div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
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
            <button className="bg-blue-500 text-white p-2 rounded-lg ml-2 hover:bg-blue-600" onClick={handleSendMessage}>
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
  );
}

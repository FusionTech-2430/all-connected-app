 'use client'

import { useState, useEffect } from 'react'
import { Bell, MessageSquare, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { onValue, ref } from 'firebase/database'
import { database } from '@/lib/firebase/config'

interface Notification {
  id: string
  tipo: 'Chat' | 'Pedido'
  titulo: string
  descripcion: string
}

export default function NotificationIcon() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const notificationsRef = ref(database, 'notifications')

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const formattedNotifications: Notification[] = Object.entries(data).map(([id, notification]) => ({
          id,
          ...(notification as Omit<Notification, 'id'>)
        }))
        setNotifications(formattedNotifications)
      } else {
        setNotifications([])
      }
    })

    return () => unsubscribe()
  }, [])

  const getNotificationIcon = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'Chat':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'Pedido':
        return <Package className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'Chat':
        return 'bg-blue-100'
      case 'Pedido':
        return 'bg-green-100'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative" 
          aria-label={`Notificaciones ${notifications.length > 0 ? `(${notifications.length} no leídas)` : ''}`}
        >
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Notificaciones</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label="Cerrar notificaciones">
            ✕
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 p-4">No hay notificaciones</p>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="flex items-start gap-4 p-4 border-b last:border-b-0 transition-colors hover:bg-gray-50"
              >
                <div className={`rounded-full p-2 ${getNotificationColor(notification.tipo)}`}>
                  {getNotificationIcon(notification.tipo)}
                </div>
                <div>
                  <h3 className="font-medium">{notification.titulo}</h3>
                  <p className="text-sm text-gray-500">{notification.descripcion}</p>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
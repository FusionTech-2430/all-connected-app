import React, { Suspense } from 'react'
import Chat from '@/components/chat/ChatInterface'

const MessagePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <Chat />
      </Suspense>
    </div>
  )
}

export default MessagePage

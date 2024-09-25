import React, { Suspense } from 'react'
import Chat from '@/components/chat'

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

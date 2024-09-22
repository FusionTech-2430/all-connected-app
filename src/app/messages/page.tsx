import React, { Suspense } from 'react';
import Chat from '@/components/Chat';

const MessagePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <Chat />
      </Suspense>
    </div>
  );
};

export default MessagePage;


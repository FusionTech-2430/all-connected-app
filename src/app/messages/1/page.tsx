import React from 'react';
import Chat from '@/components/Chat'; 

const MessagePage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1>Mensajes del chat {params.id}</h1>
      <Chat />
    </div>
  );
};

export default MessagePage;

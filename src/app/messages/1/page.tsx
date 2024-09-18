import React from 'react';
import Chat from '@/components/Chat'; 

const MessagePage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <Chat />
    </div>
  );
};

export default MessagePage;

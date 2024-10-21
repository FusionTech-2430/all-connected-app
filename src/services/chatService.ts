import { ref, onValue, push, set } from 'firebase/database';
import { database, storage } from '@/lib/firebase/config';
import { Chat, Message } from '@/types/chat/Message';
import { formatFriendlyDate } from '@/utils/date-utils';
import { uploadBytesResumable, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { getUser } from './userService';

// Función para obtener los chats del usuario
export const fetchUserChats = (id_user: string, setMessages: (messages: Chat[]) => void) => {
    const chatsRef = ref(database, 'chats');
  
    onValue(chatsRef, async (snapshot) => {
      const chatsData = snapshot.val();
      const userChats: Chat[] = [];
  
      // Filtrar los chats donde el usuario actual está presente
      for (const chatId in chatsData) {
        const chat = chatsData[chatId];
        const usersInChat = chat.users;
  
        // Verificar si el usuario actual está en este chat
        if (Object.values(usersInChat).includes(id_user)) {
          const otherUserId = Object.values(usersInChat).find((uid) => uid !== id_user);
  
          // Obtener el nombre del otro usuario mediante el servicio getUser
          let otherUserName = 'Desconocido'; // Valor por defecto si no se encuentra el usuario
          if (typeof otherUserId === 'string') {
            try {
              const otherUserData = await getUser(otherUserId); // Llama al servicio para obtener el usuario
              otherUserName = otherUserData?.fullname || otherUserName; // Asigna el nombre completo si está disponible
            } catch (error) {
              console.error('Error getting user name:', error);
            }
          }
  
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
            name: otherUserName, // Muestra el nombre del otro usuario en lugar del ID
            date: lastMessageDate,
          });
        }
      }
  
      setMessages(userChats);
    });
  };

// Función para cargar el nombre del chat
export const loadChatName = (id: string, setChatName: (name: string) => void) => {
  const chatRef = ref(database, `chats/${id}/name`);
  onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setChatName(data);
    } else {
      setChatName('Cliente All Connected');
    }
  });
};

// Función para cargar mensajes desde Firebase
export const loadMessages = (id: string, setMessages: (messages: Message[]) => void) => {
  const chatRef = ref(database, `chats/${id}/messages`);
  onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const chatMessages = Object.values(data);
      setMessages(chatMessages as Message[]);
    }
  });
};

// Función para enviar un mensaje
export const sendMessage = (id: string, inputMessage: string, id_user: string) => {
  if (inputMessage.trim() !== '') {
    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: id_user, // Almacenar el ID del usuario que envía el mensaje
      time: Date.now()
    };

    const messagesRef = ref(database, `chats/${id}/messages`);
    push(messagesRef, newMessage);
  }
};

// Función para subir archivos y enviar mensajes con archivo adjunto
export const uploadFileAndSendMessage = (
  id: string,
  file: File,
  id_user: string,
  setError: (error: string) => void
) => {
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
      setError('Error al subir archivo');
    },
    () => {
      // Obtener la URL de descarga cuando la subida se complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const isImage = file.type.startsWith('image/');
        const newMessage: Message = {
          id: Date.now(),
          text: isImage ? '' : `Archivo: ${file.name}`,
          sender: id_user, // Almacenar el ID del usuario que envía el archivo
          time: Date.now(),
          file: {
            name: file.name,
            url: downloadURL,
            type: isImage ? 'image' : 'document'
          }
        };

        const chatRef = ref(database, `chats/${id}/messages`);
        push(chatRef, newMessage);
      });
    }
  );
};

export const createChat = (name:string, id_user: string, otherUserId: string) => {
    const chatsRef = ref(database, 'chats');
    const newChatRef = push(chatsRef);
    set(newChatRef, {
        name: name,
        users: [id_user, otherUserId]
        }
    );
};

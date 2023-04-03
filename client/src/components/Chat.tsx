import React, { useRef } from 'react';
import { socket } from '../socket';

import { ChatMessage } from '../types';

type Props = {
  messages: ChatMessage[];
}

const Chat = function(props: Props) {
  console.log('Chat rerendered!');
  const newMessage = useRef<HTMLInputElement>(null);

  function sendChatMessage() {
    if (newMessage.current && newMessage.current.value) {
      socket.emit('chat-message', { event: 'CHAT_MESSAGE', message: newMessage.current.value });
      newMessage.current.value = "";
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'Enter') return;
    sendChatMessage();
  }

  return (
    <>
      <ul className='border-solid border-2 border-sky-500 w-full h-52 p-1 overflow-auto'>
          { props.messages.map((message, index) => (
              <li key={index} className="m-0 pt-2 pb-2 break-words">
                  <span className='font-bold'>{message.author.substring(0, 3)}: </span>{message.message}
              </li>
          ))}
      </ul>
      <div className='flex'>
          <input className="flex-auto w-10/12 m-0 p-1" type="text" /* value={newMessage} */
            ref={newMessage}
            onKeyDown={handleKeyDown}
            placeholder="Enter chat message..." 
            min='1'
          />
          <button className="flex-auto w-2/12 m-0 p-1 rounded-none bg-sky-800" type="button" onClick={sendChatMessage}>Send</button>
      </div>
    </>
  )
}

export default React.memo(Chat);
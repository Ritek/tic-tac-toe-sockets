import React, { useState } from 'react';
import { ChatMessage } from './App';

type Props = {
  messages: ChatMessage[];
  sendChatMessage: (newMessage: string) => void;
}

function Chat(props: Props) {
  const [newMessage, setNewMessage] = useState('');

  function sendChatMessage() {
    if (newMessage === '') return;
    props.sendChatMessage(newMessage);
    setNewMessage('');
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'Enter') return;
    props.sendChatMessage(newMessage);
    setNewMessage('');
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
          <input className="flex-auto w-10/12 m-0 p-1" type="text" value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              onKeyDown={handleKeyDown}
              placeholder="Enter chat message..." 
              min='1'
          />
          <button className="flex-auto w-2/12 m-0 p-1 rounded-none bg-sky-800" type="button" onClick={sendChatMessage}>Send</button>
      </div>
    </>
  )
}

export default Chat
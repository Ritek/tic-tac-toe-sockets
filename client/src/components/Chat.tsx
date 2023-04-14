import React, { useRef } from 'react';

import { useGetMessagesQuery, useSendMessageMutation } from '../features/chat/chatApi';

const Chat = function() {
  console.log('Chat rerendered!');
  const { data, error, isLoading } = useGetMessagesQuery();
  const [ sendMessage ] = useSendMessageMutation();
  const newMessage = useRef<HTMLInputElement>(null);

  function sendChatMessage() {
    if (newMessage.current && newMessage.current.value) {
      sendMessage(newMessage.current.value);
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
          {
            data?.map((message, index) => (
              <li key={index} className="m-0 pt-2 pb-2 break-words">
                <span className='font-bold'>{message.author.substring(0, 6)}: </span>{message.message}
              </li>
            ))
          }
      </ul>
      <div className='flex'>
          <input className="flex-auto w-10/12 m-0 p-1" type="text"
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
import React, { useRef } from 'react';

import { useGetMessagesQuery, useSendMessageMutation } from '../../features/chat/chatApi';

const Chat = function() {
  const { data: messages, error, isLoading } = useGetMessagesQuery();
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
      <ul className='border-solid border-2 border-sky-700 w-full h-52 p-1 overflow-auto'>
        {
          messages?.map((message, index) => (
            <li key={index} className="m-0 break-words hover:bg-gray-800">
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
          maxLength={30}
        />
        <button type="button" 
          className="flex-auto w-2/12 m-0 p-1 rounded-none bg-sky-700 hover:bg-sky-600" 
          onClick={sendChatMessage}>Send
        </button>
      </div>
    </>
  )
}

export default React.memo(Chat);
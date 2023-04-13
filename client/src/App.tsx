import { useState, useEffect } from 'react';
import { socket } from './socket';

import Board from './components/Board';
import Chat from './components/Chat';
import WinnerModal from './components/WinnerModal';

import { ChatMessage, ServerMessage } from './types';

function App() {
  const [messages, setMessages] = useState(new Array<ChatMessage>());
  const [board, setBoard] = useState(new Array<'X' | 'O' | null>(9).fill(null));
  const [winner, setWinner] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    socket.on('chat-message', (msg) => {
      setMessages([...messages, msg]); 
    });

    socket.on('move-made', (msg: ServerMessage) => {
      setBoard(msg.gameState);

      if ('winner' in msg) {
        setWinner(msg.winner);
        setShowModal(true);
      }
    });

    return () => {
      socket.off('chat-message');
      socket.off('move-made');
      socket.off();
    };
  }, [socket, messages]);

  return (
    <div className="p-8 mb-28">
      <WinnerModal setIsVisible={setShowModal} showModal={showModal} text={winner} />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <div className="min-w-[300px] max-w-screen-sm">
          <Board board={board} />
        </div>
        
        <div className="min-w-[300px] max-w-screen-sm">
          <Chat messages={messages} />
        </div>
      </div>

    </div>
  );
}

export default App

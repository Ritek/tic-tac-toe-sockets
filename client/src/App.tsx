import { useState, useEffect } from 'react';
import { socket } from './socket';

import Board from './components/Board';
import Chat from './components/Chat';
import ConnectionButton from './components/ConnectionButton';
import WinnerModal from './components/WinnerModal';

import { ChatMessage, ServerMessage } from './types';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState(new Array<ChatMessage>());
  const [board, setBoard] = useState(new Array<'X' | 'O' | null>(9).fill(null));
  const [winner, setWinner] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('chat-message', (msg) => {
      setMessages([...messages, msg]); 
      console.log('chat-message:', msg);
    });
    socket.on('all-rooms', msg => console.log('all-rooms:', msg));

    socket.on('move-made', (msg: ServerMessage) => {
      console.log('move-made:', msg.gameState);
      setBoard(msg.gameState);

      if ('winner' in msg) {
        setWinner(msg.winner);
        setShowModal(true);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat-message');
      socket.off('move-made');
    };
  }, [socket, messages, board]);

  return (
    <div className="p-8 mb-28">

      <button onClick={() => setShowModal(!showModal)}>Show</button>
      <ConnectionButton isConnected={isConnected} />

      {/* <Modal isVisible={showModal} setIsVisible={setShowModal} hideAfter={3000}>
        <Modal.Text text='Player X wins!' />
        <Modal.Button label='OK' close={() => setShowModal(false)} />
      </Modal> */}
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

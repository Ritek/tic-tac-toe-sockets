import { useState, useEffect } from 'react';
import { socket } from './socket';

import './App.css';
import Board from './Board';
import Chat from './Chat';
import ConnectionButton from './ConnectionButton';
import Modal from './Modal';

export type ChatMessage = {
  author: string;
  message: string;
}

type MoveMessage = {
  event: 'MOVE';
  turn: number;
  gameState: (string | null)[];
}

type GameOverMessage = {
  event: 'MOVE';
  turn: number;
  winner: string;
  gameState: (string | null)[];
}

type ServerMessage = MoveMessage | GameOverMessage;

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState(new Array<ChatMessage>());
  const [board, setBoard] = useState(new Array<string | null>(9).fill(null));
  const [winner, setWinner] = useState<null | string>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log("Connected!");
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat-message', (msg) => {
      setMessages([...messages, msg])
    });

    socket.on('move-made', (msg: ServerMessage) => {
      console.log('move-made', msg);
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
  }, [socket, messages]);

  function sendChatMessage(newMessage: string) {
    socket.emit('chat-message', { event: 'CHAT_MESSAGE', message: newMessage });
  }

  function sendMoveMade(squareIndex: number) {
    socket.emit('move-made', { event: 'MOVE', change: squareIndex });
  }

  function changeConnection() {
    if (isConnected) socket.disconnect();
    else socket.connect();
  }

  return (
    <div className="m-auto p-10 mb-28">
      <button onClick={() => setShowModal(!showModal)}>Show</button>
      <Modal isVisible={showModal} setIsVisible={setShowModal} hideAfter={3000}>
        <Modal.Text text='Player X wins!' />
        <Modal.Button label='OK' close={() => setShowModal(false)} />
      </Modal>
      <ConnectionButton isConnected={isConnected} changeConnection={changeConnection}/>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <div className="min-w-[300px] max-w-screen-sm">
          <Board board={board} sendMoveMade={sendMoveMade}/>
        </div>
        
        <div className="min-w-[300px] max-w-screen-sm">
          <Chat messages={messages} sendChatMessage={sendChatMessage}/>
        </div>
      </div>

    </div>
  );
}

export default App

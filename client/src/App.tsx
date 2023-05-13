import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import SessionStatus from './components/SessionStatus';
// import UsernameModal from './components/UsernameModal';
import UsernameModal from './components/Modals/UsernameModal';

// import { useGetSessionQuery } from './globalApi';
import { useGetSessionQuery } from './features/session/sessionApi';

type Props = {
    sessionID: string | null;
    children: React.ReactNode;
}

type SessionPayload = { sessionID: string } 
                    | { username: string }

function App(props: Props) {
    const { data: session } = useGetSessionQuery();
    const [showUsernameModal, setShowUsernameModal] = useState<boolean>(!session?.sessionID);

    useEffect(() => {
        if (props.sessionID) {
            connectToServer({sessionID: props.sessionID});
        }    
    }, []);

    useEffect(() => {
        !session 
            ? setShowUsernameModal(true)
            : setShowUsernameModal(false);
    }, [session]);

    function connectToServer(payload: SessionPayload) {
        socket.auth = { ...payload };
        socket.connect();
    }

    return (
        <>
            <UsernameModal 
                isVisible={showUsernameModal} 
                close={() => setShowUsernameModal(false)} 
                submit={(username) => connectToServer({username})}
            />
            <div className='px-4'>
                <SessionStatus />
                { session ? props.children : null }
            </div>
        </>
    );
}

export default App;
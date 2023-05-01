import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import SessionStatus from './components/SessionStatus';
import UsernameModal from './components/UsernameModal';

import { useGetSessionQuery } from './globalApi';

type Props = {
    sessionID: string | null;
    children: React.ReactNode;
}

type SessionPayload = {
    sessionID: string
} | {
    username: string
}

function App(props: Props) {
    const { data: session } = useGetSessionQuery();
    const [showUsernameModal, setShowUsernameModal] = useState<boolean>(!session?.sessionID);

    useEffect(() => {
        if (!session) {
            setShowUsernameModal(true);
        } else {
            setShowUsernameModal(false);
        }
    }, [session]);

    if (props.sessionID) {
        getSession({sessionID: props.sessionID});
    }

    function closeModal(username: string) {
        setShowUsernameModal(false);
        getSession({username});
    }

    function getSession(payload: SessionPayload) {
        console.log('payload:', { ...payload });
        socket.auth = { ...payload };
        socket.connect();
    }

    return (
        <div className='px-4'>
            <UsernameModal isVisible={showUsernameModal} closeModal={closeModal} />
            <SessionStatus />
            { props.children }
        </div>
    );
}

export default App;
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Session = {
    sessionID: string;
    userID: string;
    username: string;
}

const initialState: Partial<Session> = { 
    sessionID: undefined,
    userID: undefined,
    username: undefined,
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setSession(state, action: PayloadAction<Session>) {
            if (!action.payload.sessionID) return;

            state = action.payload;
            localStorage.setItem('sessionID', action.payload.sessionID);
        },
        removeSession(state) {
            state = {
                sessionID: undefined,
                userID: undefined,
                username: undefined,
            }
            localStorage.removeItem('sessionID');
        }
    },
});

export const { setSession, removeSession } = sessionSlice.actions;
export default sessionSlice.reducer;
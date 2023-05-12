/* import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { socket } from '../../socket';

type Chat = {
    messages: string[];
    loading: boolean;
}

const initialState: Chat = {
    messages: [],
    loading: false
}

export const getMessages = createAsyncThunk('chat/getMessages', async () => {
    return await new Promise((resolve, reject) => {
        socket.on('chat-message', msg => {
            resolve(msg);
        });
    });
});

const chatSlice = createSlice({
    name: 'chatSlice',
    initialState,
    reducers: {
        
    },
    extraReducers(builder) {
        builder.addCase(getMessages.pending, (state, action) => {
            state.
            state.messages.push(action.)
        });
    }
});

export const {  } = chatSlice.actions;

export default chatSlice.reducer; */
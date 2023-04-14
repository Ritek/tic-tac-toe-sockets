import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { socket } from '../../socket';

export type Room = string;

type ChatMessage = {
    author: string;
    message: string;
}

export const chatApi = createApi({
    reducerPath: 'chatApi',
    // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
    baseQuery: async () => {
        console.log('baseQuery');
        // await connected;
        return { data: [] };
    },
    endpoints: (build) => ({
        getMessages: build.query<ChatMessage[], void>({
            query: () => '',
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: ChatMessage) => {
                        console.log('event:', event);
                        if (!event) return;
            
                        updateCachedData((draft) => {
                            draft.push({author: event.author, message: event.message});
                        });
                    }
        
                    socket.on('chat-message', (msg) => {
                        console.log('chat-message', msg);
                        listener(msg);
                    });
                } catch {
                  // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                  // in which case `cacheDataLoaded` will throw
                  console.log('chatApi caught error!');
                }
                await cacheEntryRemoved;
                socket.off('chat-message');
            },
        }),
        sendMessage: build.mutation<unknown, string>({
            query: (message) => {
                socket.emit('chat-message', { event: 'CHAT_MESSAGE', message });
            }
        })
    }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = chatApi;
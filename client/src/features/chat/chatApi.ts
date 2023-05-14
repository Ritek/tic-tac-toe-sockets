import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { socket } from '../../socket';
import { ChatMessage } from '../../types';

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fakeBaseQuery(),
    endpoints: (build) => ({
        getMessages: build.query<ChatMessage[], void>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: ChatMessage) => {
                        if (!event) return;
            
                        updateCachedData((draft) => {
                            draft.push({author: event.author, message: event.message});
                        });
                    }
        
                    socket.on('chat-message', (msg) => {
                        listener(msg);
                    });
                } catch {
                  console.log('globalApi -> getMessages caught error!');
                }
                await cacheEntryRemoved;
            },
        }),
        sendMessage: build.mutation<unknown, string>({
            queryFn: (message) => {
                socket.emit('chat-message', { event: 'CHAT_MESSAGE', message });
                return { data: null };
            }
        })
    }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = chatApi;
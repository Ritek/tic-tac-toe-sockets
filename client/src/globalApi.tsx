import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { socket } from './socket';

type ChatMessage = {
    author: string;
    message: string;
}

type BoardState = ('X' | 'O' | null)[];

type AvaibleRoom = {
    name: string;
    isPrivate: boolean;
    players: 0 | 1 | 2;
}

type NewRoom = {
    name: string;
} & ({
    isPrivate: false;
} | {
    isPrivate: true;
    password: string;
});

type NewRoomSuccessResponse = {
    status: 201;
    newRoom: {
        name: string;
    }
}

type NewRoomErrorResponse = {
    status: 409;
    error: string;
}

type NewRoomResponse = NewRoomSuccessResponse | NewRoomErrorResponse;
type NewRoomMutationResult = {
    data: NewRoomSuccessResponse;
} | {
    error: NewRoomErrorResponse;
}

type JoinRoomRequest = {
    name: string;
    password?: string;
}

type JoinRoomResponse = {
    status: 200;
} | {
    status: 400;
    errorMessage: string;
}
type JoinRoomMutationResult = {
    data: { status: 200 }
} | {
    error: { status: 400, errorMessage: string }
}

export const globalApi = createApi({
    reducerPath: 'globalApi',
    baseQuery: async () => {
        console.log('baseQuery');
        return { data: [] };
    },
    endpoints: (build) => ({
        // Chat API
        getMessages: build.query<ChatMessage[], void>({
            queryFn: () => ({ data: [] }),
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
            queryFn: (message) => {
                socket.emit('chat-message', { event: 'CHAT_MESSAGE', message });
                return { data: true };
            }
        }),

        // Board API
        getNewGameState: build.query<BoardState, void>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: {event: string, turn: number, gameState: []}) => {
                        console.log('event:', event);
                        if (!event) return;
            
                        updateCachedData((draft) => {
                            event.gameState.forEach((state, index) => {
                                draft[index] !== state ? draft[index] = state : draft[index]
                            })
                        });
                    }
        
                    socket.on('move-made', (msg) => {
                        console.log('move-made', msg);
                        listener(msg);
                    });
                } catch {
                  console.log('gameApi caught error!');
                }
                await cacheEntryRemoved;
                // socket.off('move-made');
            },
        }),
        makeMove: build.mutation<unknown, number>({
            queryFn: (changedSquereIndex) => {
                console.log('makeMove');
                socket.emit('move-made', { event: 'MOVE', changedSquereIndex });
                return { data: true };
            }
        }),

        // Room API
        getRooms: build.query<AvaibleRoom[], void>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: AvaibleRoom[]) => {
                        console.log('event:', event);
                        if (!event) return;
            
                        updateCachedData((draft) => {
                            draft.length = 0;
                            /* event.forEach((room, iter) => {
                                draft[iter] = room;
                            }); */
                            draft.push(...event)
                        });
                    }

                    socket.on('all-rooms', (msg) => {
                        console.log('all-rooms', msg);
                        listener(msg);
                    });
                } catch {
                  console.log('roomApi caught error!');
                }
                await cacheEntryRemoved;
                socket.off('all-rooms');
            },
        }),
        createRoom: build.mutation<NewRoomResponse, NewRoom>({
            queryFn: async (newRoom) => {
                const temp = await new Promise<NewRoomMutationResult>((resolve, reject) => {
                    socket.emit("create-room", newRoom, (response: NewRoomResponse) => {
                        if (response.status === 201) {
                            resolve({data: response});
                        } else {
                            resolve({error: response});
                        }
                    });
                });
                console.log(temp);
                return temp;
            }
        }),
        joinRoom: build.mutation<JoinRoomResponse, JoinRoomRequest>({
            queryFn: async (roomDetails) => {
                return await new Promise<JoinRoomMutationResult>((resolve) => {
                    socket.emit("join-room", roomDetails, (response: JoinRoomResponse) => {
                        if (response.status === 200) {
                            resolve({data: response});
                        } else {
                            resolve({error: response});
                        }
                    });
                });
            }
        }),
        leaveRoom: build.mutation<unknown, void>({
            queryFn: () => {
                socket.emit('leave-room');
                return { data: null }
            }
        })
    }),
});

export const { 
    useGetMessagesQuery, useSendMessageMutation, 
    useGetNewGameStateQuery, useMakeMoveMutation,
    useGetRoomsQuery, useCreateRoomMutation, useJoinRoomMutation, useLeaveRoomMutation
} = globalApi;
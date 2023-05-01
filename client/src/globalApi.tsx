import { createApi } from '@reduxjs/toolkit/query/react';
import { socket } from './socket';
import { ChatMessage, GameState, NewRoomParameters, AvaibleRoom, Player, JoinRoomParams } from './types'

type NewRoomResponseSuccess = {
    status: 201;
    newRoom: { name: string; }
}

type NewRoomResponseFailure = {
    status: 409;
    error: string;
}

type NewRoomResponse = NewRoomResponseSuccess | NewRoomResponseFailure;
type NewRoomMutationResult<TResp extends NewRoomResponse> = 
    TResp extends NewRoomResponseSuccess 
        ? { data: TResp }
        : { error: TResp };

type JoinRoomResponseSuccess = {
    status: 200;
    newPlayer: Player;
    gameState: GameState;
}

type JoinRoomResponseFailure = {    
    status: 400;
    errorMessage: string;
}

type JoinRoomResponse = JoinRoomResponseSuccess | JoinRoomResponseFailure;
type JoinRoomMutationResult<TResp extends JoinRoomResponse> = 
    TResp extends JoinRoomResponseSuccess 
        ? { data: TResp }
        : { error: TResp };

// type MutationResponse2<TResp extends Record<string, any>> = undefined extends TResp['error'] 
//     ? { data: TResp }
//     : { error: TResp } 

// type MutationResponse<TResp extends Record<string, any>> = TResp['status'] extends 200
//     ? { data: TResp }
//     : { error: TResp } 

// const x: MutationResponse<{status: 200}>;
// const x2: MutationResponse<{status: 400}>;

type Session = {
    sessionID: string;
    userID: string;
    username: string;
}
    

export const globalApi = createApi({
    reducerPath: 'globalApi',
    baseQuery: async () => {
        console.log('baseQuery');
        return { data: [] };
    },
    tagTypes: ['session'],
    endpoints: (build) => ({
        // Session API
        getSession: build.query<Session | undefined, void>({
            queryFn: () => ({ data: undefined }),
            providesTags: ['session'],
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: Session) => {
                        console.log('event:', event);
                        if (!event) return;
            
                        updateCachedData((draft) => {
                            localStorage.setItem('sessionID', event.sessionID);
                            return event;
                        });
                    }
        
                    socket.on('session', (msg) => {
                        console.log('session', msg);
                        listener(msg);
                    });
                } catch {
                  console.log('globalApi -> getSession caught error!');
                }
                await cacheEntryRemoved;
                socket.off('session');
            },
        }),
        deleteSession: build.mutation<unknown, string>({
            queryFn: (sessionID) => {
                socket.emit('delete-session', sessionID);
                localStorage.removeItem('sessionID');
                return { data: null };
            },
            invalidatesTags: (result, error, arg) => [{ type: 'session' }],
        }),

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
                return { data: null };
            }
        }),

        // Board API
        getNewGameState: build.query<GameState, void>({
            queryFn: () => ({ data: {event: 'move-made', turn: 0, boardState: new Array(9).fill(null)} }),
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: GameState) => {

                        console.log('event:', event);
                        if (!event) return;
            
                        updateCachedData((draft) => {
                            return event;
                        });
                    }
        
                    socket.on('move-made', (msg) => {
                        listener(msg);
                    });
                } catch {
                  console.log('getNewGameState caught error!');
                }
                await cacheEntryRemoved;
            },
        }),
        makeMove: build.mutation<unknown, number>({
            queryFn: (changedSquereIndex) => {
                socket.emit('move-made', { event: 'MOVE', changedSquereIndex });
                return { data: null };
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
                            event.forEach((room, iter) => {
                                draft[iter] = room;
                            });
                        });
                    }

                    socket.on('all-rooms', (msg) => {
                        console.log('all-rooms', msg);
                        listener(msg);
                    });
                } catch {
                  console.log('getRooms caught error!');
                }
                await cacheEntryRemoved;
            },
        }),
        createRoom: build.mutation<NewRoomResponse, NewRoomParameters>({
            queryFn: async (newRoom) => {
                const temp = await new Promise<NewRoomMutationResult<NewRoomResponse>>((resolve, reject) => {
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
        joinRoom: build.mutation<JoinRoomResponse, JoinRoomParams>({
            queryFn: async (roomDetails) => {
                return await new Promise<JoinRoomMutationResult<JoinRoomResponse>>((resolve) => {
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
    useGetSessionQuery, 
    useDeleteSessionMutation,

    useGetMessagesQuery, 
    useSendMessageMutation, 

    useGetNewGameStateQuery, 
    useMakeMoveMutation, 

    useGetRoomsQuery, 
    useCreateRoomMutation, 
    useJoinRoomMutation, 
    useLeaveRoomMutation
} = globalApi;
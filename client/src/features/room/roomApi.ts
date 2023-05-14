import { createApi, fakeBaseQuery, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { socket } from '../../socket';
import { 
    GameState, 
    NewRoomParameters, 
    AvaibleRoom, 
    Player, 
    JoinRoomParameters 
} from '../../types'

type NewRoomResponseSuccess = {
    status: 201;
    newRoom: { name: string; }
}

type NewRoomResponseFailure = {
    status: 409;
    data: string;
}

type NewRoomResponse = NewRoomResponseSuccess | NewRoomResponseFailure;

type JoinRoomResponseSuccess = {
    status: 200;
    newPlayer: Player;
    gameState: GameState;
}

type JoinRoomResponseFailure = {    
    status: 400;
    data: string;
}

type JoinRoomResponse = JoinRoomResponseSuccess | JoinRoomResponseFailure;

type FailureResponse = {
    status: 400 | 409;
    data: string;
}

export const roomApi = createApi({
    reducerPath: 'roomApi',
    baseQuery: fakeBaseQuery<FailureResponse>(),
    //baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
    endpoints: (build) => ({
        getRooms: build.query<AvaibleRoom[], void>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: AvaibleRoom[]) => {
                        if (!event) return;
            
                        updateCachedData((draft) => {
                            return event;
                        });
                    }

                    socket.on('all-rooms', (msg) => {
                        listener(msg);
                    });
                } catch {
                  console.log('globalApi -> getRooms caught error!');
                }
                await cacheEntryRemoved;
            },
        }),
        createRoom: build.mutation<NewRoomResponseSuccess, NewRoomParameters>({
            queryFn: async (newRoom) => {
                const result = await new Promise<NewRoomResponse>((resolve, reject) => {
                    socket.emit('create-room', newRoom, (response: NewRoomResponse) => {
                        resolve(response);
                    });
                });
                
                return result.status === 201
                    ? { data: result }
                    : { error: result };
            }
        }),
        joinRoom: build.mutation<JoinRoomResponseSuccess, JoinRoomParameters>({
            queryFn: async (roomDetails) => {
                const result = await new Promise<JoinRoomResponse>((resolve, reject) => {
                    socket.emit("join-room", roomDetails, (response: JoinRoomResponse) => {
                        resolve(response);
                    });
                });

                return result.status === 200 
                    ? { data: result } 
                    : { error: result };
            },
        }),
        leaveRoom: build.mutation<unknown, void>({
            queryFn: () => {
                socket.emit('leave-room');
                return { data: null }
            }
        })
    })
});

export const { 
    useGetRoomsQuery, 
    useCreateRoomMutation, 
    useJoinRoomMutation, 
    useLeaveRoomMutation
} = roomApi;
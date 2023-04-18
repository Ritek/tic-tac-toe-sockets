import { createApi } from '@reduxjs/toolkit/query/react';
import { socket } from '../../socket';

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

export const roomApi = createApi({
    reducerPath: 'roomApi',
    baseQuery: async () => {
        return { data: [] };
    },
    endpoints: (build) => ({
        getRooms: build.query<AvaibleRoom[], void>({
            query: () => '',
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
                const newRoomResponse = await new Promise<NewRoomMutationResult>((resolve, reject) => {
                    socket.emit("create-room", newRoom, (response: NewRoomResponse) => {
                        if (response.status === 201) {
                            resolve({data: response});
                        } else {
                            resolve({error: response});
                        }
                    });
                });

                return newRoomResponse;
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
            query: () => {
                socket.emit('leave-room');
            }
        })
        
    }),
});

export const { 
    useGetRoomsQuery, useCreateRoomMutation, 
    useJoinRoomMutation, useLeaveRoomMutation 
} = roomApi;
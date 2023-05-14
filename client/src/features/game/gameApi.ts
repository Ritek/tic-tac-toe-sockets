import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { socket } from '../../socket';
import { GameState } from '../../types'

export const gameApi = createApi({
    reducerPath: 'gameApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['game-state'],
    endpoints: (build) => ({
        getNewGameState: build.query<GameState | undefined, void>({
            queryFn: () => ({ data: undefined }),
            providesTags: ['game-state'],
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: GameState) => {
                        if (!event) return;
            
                        updateCachedData((draft) => {
                            return event;
                        });
                    }
        
                    socket.on('game-state', (msg) => {
                        listener(msg);
                    });
                } catch {
                  console.log('globalApi -> getNewGameState caught error!');
                }
                await cacheEntryRemoved;
            },
        }),
        makeMove: build.mutation<unknown, number>({
            queryFn: (changedSquereIndex) => {
                socket.emit('new-move', { event: 'MOVE', changedSquereIndex });
                return { data: null };
            }
        }),
    }),
});

export const { useGetNewGameStateQuery, useMakeMoveMutation } = gameApi;
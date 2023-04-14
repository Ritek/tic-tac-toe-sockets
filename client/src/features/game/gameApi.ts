import { createApi } from '@reduxjs/toolkit/query/react';
import { socket } from '../../socket';

type BoardState = ('X' | 'O' | null)[];

export const gameApi = createApi({
    reducerPath: 'gameApi',
    baseQuery: async () => {
        console.log('baseQuery');
        return { data: new Array(9).fill(null) };
    },
    endpoints: (build) => ({
        getNewGameState: build.query<BoardState, void>({
            query: () => '',
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
                socket.off('move-made');
            },
        }),
        makeMove: build.mutation<unknown, number>({
            query: (changedSquereIndex) => {
                socket.emit('move-made', { event: 'MOVE', changedSquereIndex })
            }
        })
    }),
});

export const { useGetNewGameStateQuery, useMakeMoveMutation } = gameApi;
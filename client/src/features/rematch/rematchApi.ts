import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { socket } from '../../socket';

export const rematchApi = createApi({
    reducerPath: 'rematchApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['rematch'],
    endpoints: (build) => ({
        getRematchRequest: build.query<string, void>({
            queryFn: () => ({ data: '' }),
            providesTags: ['rematch'],
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: string) => {
                        console.log('before event', event);
                        if (!event) return;
                        console.log('after event');
            
                        updateCachedData((draft) => {
                            console.log(draft);
                            return 'Oponent requested rematch';
                        });
                    }
        
                    socket.on('confirm-rematch', (msg) => {
                        console.log('globalAPI confirm-rematch', msg);
                        listener(msg);
                    });
                } catch {
                  console.log('globalApi -> getRematchRequest caught error!');
                }
                await cacheEntryRemoved;
            },
        }),
        requestRematch: build.mutation<unknown, void>({
            queryFn: () => {
                socket.emit('rematch-request');
                return { data: null };
            },
            // invalidatesTags: (result, error, arg) => [{ type: 'rematch' }],
        }),
        confirmRematch: build.mutation<unknown, void>({
            queryFn: () => {
                socket.emit('rematch-approved');
                return { data: null };
            },
            invalidatesTags: (result, error, arg) => [{ type: 'rematch' }],
        }),
    })
});

export const { 
    useGetRematchRequestQuery,
    useRequestRematchMutation,
    useConfirmRematchMutation
} = rematchApi;
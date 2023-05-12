import { createApi, fakeBaseQuery, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { socket } from '../../socket';

type Session = {
    sessionID: string;
    userID: string;
    username: string;
}

export const sessionApi = createApi({
    reducerPath: 'sessionApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['session'],
    endpoints: (build) => ({
        getSession: build.query<Session | undefined, void>({
            queryFn: () => ({ data: undefined }),
            providesTags: ['session'],
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
        
                    const listener = (event: Session) => {
                        if (!event) return;
            
                        updateCachedData((draft) => {
                            localStorage.setItem('sessionID', event.sessionID);
                            return event;
                        });
                    }
                    
                    socket.on('session', (msg) => {
                        listener(msg);
                    });
                } catch {
                  console.log('globalApi -> getSession caught error!');
                }
                await cacheEntryRemoved;
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
    })
});

export const { 
    useGetSessionQuery,
    useDeleteSessionMutation
} = sessionApi;
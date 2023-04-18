import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// import { chatApi } from './features/chat/chatApi';
// import { gameApi } from './features/game/gameApi';
// import { roomApi } from './features/room/roomApi';
import { globalApi } from './globalApi';

export const store = configureStore({
/*   reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    [gameApi.reducerPath]: gameApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(chatApi.middleware, gameApi.middleware, roomApi.middleware), */
    reducer: {
      [globalApi.reducerPath]: globalApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
      .concat(globalApi.middleware)
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
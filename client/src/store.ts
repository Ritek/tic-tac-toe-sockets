import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// import { globalApi } from './globalApi';

import { roomApi } from './features/room/roomApi';
import { chatApi } from './features/chat/chatApi';
import { gameApi } from './features/game/gameApi';
import { rematchApi } from './features/rematch/rematchApi';
import { sessionApi } from './features/session/sessionApi';

export const store = configureStore({
    reducer: {
      // [globalApi.reducerPath]: globalApi.reducer,
      [roomApi.reducerPath]: roomApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
      [gameApi.reducerPath]: gameApi.reducer,
      [rematchApi.reducerPath]: rematchApi.reducer,
      [sessionApi.reducerPath]: sessionApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
      // .concat(globalApi.middleware)
      .concat(roomApi.middleware)
      .concat(chatApi.middleware)
      .concat(gameApi.middleware)
      .concat(rematchApi.middleware)
      .concat(sessionApi.middleware)
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
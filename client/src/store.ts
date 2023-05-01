import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { globalApi } from './globalApi';
import sessionReducer from './features/session/sessionSlice';

export const store = configureStore({
    reducer: {
      [globalApi.reducerPath]: globalApi.reducer,
      session: sessionReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
      .concat(globalApi.middleware)
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
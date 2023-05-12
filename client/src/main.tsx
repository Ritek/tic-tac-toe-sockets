import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';

import './index.css';

import App from './App';
import Game from './components/Game/Game'
import HomeScreen from './components/HomeScreen/HomeScreen';
import ErrorPage from './components/ErrorPage';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const sessionID = localStorage.getItem("sessionID");

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/:id',
    element: <Game />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App sessionID={sessionID}>
        <RouterProvider router={router} />
      </App>
    </Provider>
  </React.StrictMode>,
);

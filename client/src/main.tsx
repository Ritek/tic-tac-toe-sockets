import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css';
import HomeScreen from './components/HomeScreen/HomeScreen';
import ErrorPage from './components/ErrorPage';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/:id',
    element: <App />,
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)

import React from 'react';
import { useRouteError } from "react-router-dom";

function ErrorPage() {
    const error: any = useRouteError();
    console.error(error);

    return (
        <div className='m-auto w-auto h-1/4 bg-black bg-opacity-5 p-10 rounded-md text-center'>
            <h1 className='text-9xl mb-3'>404</h1>
            <h3 className='text-6xl mb-3'>Page was not found!</h3>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}

export default ErrorPage
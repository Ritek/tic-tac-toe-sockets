# Tic-tac-toe build in React using WebSocket

This is a personal side-project that was build to learn and experiment. The main goals were:
* Learn WebSocket and how to use it with React
* Learn modern Redux and Redux Toolkit
* Improve Tailwind and general styling skills
* Learn more about UI/UX design

## Running the app
To run the app, run `yarn dev` inside appropriately named directories in separate terminals than open client app on localhost (default port - 5173).

## Technologies used
The app uses some of the most popular technologies:
* Socket.io
* Redux
* TypeScript
* Tailwind
* Zod

## How the app works
Whole communication between the client and server is done over Websocket. Client app uses Redux RTK middleware to subscribe and update state through Query and Mutation. Routing is done with React Router V6. Server-side validation uses Zod. All styling is done with Tailwind.

## Features
The app allows the user to:
* connect to the server and enter or create a game room
* play tic-tac-toe with another person over the Internet
* chat privately in the game room
* send, accept and decline rematch requests

## Status of the project
This project is technically finished as all planned features were implemented but some minor problems are still present. 

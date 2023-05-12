export type ChatMessage = {
    author: string;
    message: string;
}

export type PlayerToken = 'X' | 'O';

export type GameState = {
    players: {
        playerX: Player | undefined,
        playerO: Player | undefined
    }
    event: string;
    winner?: string | undefined;
    turn: number;
    boardState: ('X' | 'O' | null)[];
}

export type NewGameStateMessage = {
    event: 'NEW_GAME_STATE';
    turn: number;
    gameState: ('X' | 'O' | null)[];
}

export type GameOverMessage = {
    event: 'GAME_OVER';
    turn: number;
    winner: string;
    gameState: ('X' | 'O' | null)[];
}
  
export type ServerMessage = NewGameStateMessage | GameOverMessage;

export type AvaibleRoom = {
    name: string;
    isPrivate: boolean;
    players: 0 | 1 | 2;
}

export type NewRoomParameters = {
    name: string;
} & ({
    isPrivate: false;
} | {
    isPrivate: true;
    password: string;
});

export type JoinRoomParameters = {
    name: string;
    password?: string;
}

export type Player = {
    token: 'X' | 'O';
    userID: string;
    username: string;
    connected: boolean;
}
export type ChatMessage = {
    author: string;
    message: string;
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
import { RoomFullException, InvalidMoveException, NotAPLayerException, InvalidPasswordException } from './types';

export type PlayerToken = 'X' | 'O';

export type BoardState = (PlayerToken | null)[];

import { NewRoom, RoomInformation } from './validators'

export type GameState = {
    players: {
        playerX: Player | undefined;
        playerO: Player | undefined;
    },
    boardState: BoardState;
    turn: number;
    winner?: PlayerToken | 'draw'
}

export type Player = {
    token: PlayerToken;
    userID: string;
    username: string;
    connected: boolean;
}

export default class Room {
    readonly name: string;
    readonly isPrivate: boolean;
    readonly password?: string;

    turn: number;
    boardState: BoardState;

    playerX?: Player;
    playerO?: Player;
    // players?: Map<string, Player>

    winner?: PlayerToken | 'draw';

    constructor(params: NewRoom) {
        this.name = params.name;
        this.isPrivate = params.isPrivate;
        this.password = params.password;
        this.turn = 0;
        this.boardState = new Array(9).fill(null);
    }

    private getPlayerByID(userID: string) {
        return [this.playerX, this.playerO].find(player => player?.userID === userID);
    }

    private isPlayersTurn(playerToken: PlayerToken) {
        return (playerToken === 'X' && this.turn % 2 === 0) 
            || (playerToken === 'O' && this.turn % 2 === 1);
    }

    getRoomInfo(): RoomInformation {
        const playerNum = 0 + (this.playerX ? 1 : 0) + (this.playerO ? 1 : 0);
        return {
            name: this.name,
            isPrivate: this.isPrivate,
            players: playerNum
        }
    }

    addPlayer(userID: string, username: string, providedPassword?: string): Player | RoomFullException | InvalidPasswordException {
        const player = this.getPlayerByID(userID);
        if (player) {
            player.connected = true;
            return { ...player, connected: true }
        }
        
        if (this.playerX && this.playerO) {
            return new RoomFullException("Room is full!");
        }

        if (this.password && this.password !== providedPassword) {
            return new InvalidPasswordException("Invalid password!");
        }

        if (!this.playerX) {
            const newPlayer: Player = { token: 'X', userID, username, connected: true };
            this.playerX = newPlayer;
            return newPlayer;
        } else {
            const newPlayer: Player = { token: 'O', userID, username, connected: true };
            this.playerO = newPlayer;
            return newPlayer;
        }
    }

    removePlayer(userID: string): Player | NotAPLayerException {
        const player = this.getPlayerByID(userID);
        console.log(player);

        if (!player) {
            console.log("Not a player!");
            return new NotAPLayerException("Not a player!");
        }

        player.token === 'X' 
            ? this.playerX = undefined
            : this.playerO = undefined;

        console.log(this.playerX, this.playerO);

        this.resetGameState();

        return {...player, connected: false}
    }

    updatePlayerStatus(userID: string, status: 'connected' | 'disconnected') {
        const player = [this.playerX, this.playerO].find(player => player?.userID === userID);
        if (!player) return new NotAPLayerException("Not a player!"); 

        const newStatus = status === 'connected';
        player.connected = newStatus;
        return player;
    }

    getOtherPlayer(userID: string) {
        const player = this.getPlayerByID(userID);
        
        if (!player) {
            return new NotAPLayerException("Not a player!");
        }

        if (this.playerX && this.playerO) {
            return [this.playerX, this.playerO].find(player => player?.userID !== userID);
        } else {
            return undefined;
        }
    }

    getGameState(): GameState {
        return {
            players: {
                playerX: this.playerX,
                playerO: this.playerO
            },
            boardState: this.boardState,
            turn: this.turn,
            winner: this.winner
        }
    }

    resetGameState() {
        if (this.playerX && this.playerO) {
            [this.playerX, this.playerO] = [this.playerO, this.playerX];
            this.playerX.token = 'X';
            this.playerO.token = 'O';
        }
        
        this.boardState = new Array(9).fill(null);
        this.turn = 0;
        this.winner = undefined;
    }

    changeGameState(userID: string, changedTileIndex: number): GameState | NotAPLayerException | InvalidMoveException {
        const player = this.getPlayerByID(userID);

        if (!player) {
            return new NotAPLayerException("Not a player!");
        }

        if (!this.isPlayersTurn(player.token)) {
            return new InvalidMoveException("Not a player's turn!");
        }

        if (!this.playerX || !this.playerO ) {
            return new InvalidMoveException("Missing oponent!");
        }

        if (this.boardState[changedTileIndex] !== null) {
            return new InvalidMoveException("Tile was already changed!");
        }

        this.boardState[changedTileIndex] = player.token;
        this.turn++;
        this.checkForWinner();

        return this.getGameState();
    }

    private checkForWinner() {
        const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // lines
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6],            // diagonal
        ];

        for (const line of winningLines) {
            const firstElem = this.boardState[line[0]];
            const checkLine = line.every(index => 
                firstElem && this.boardState[index] === firstElem
            );

            if (checkLine && firstElem) {
                this.winner = firstElem;
                return;
            }
        }

        if (this.turn === 9) {
            this.winner = "draw";
            return;
        }
          
        return;
    }
}
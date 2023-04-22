import { RoomFullException, InvalidMoveException, NotAPLayerException, InvalidPasswordException } from './types';

export type PlayerStaus = 'CONNECTED' | 'INACTIVE' | 'DISCONNECTED';

export type PlayerToken = 'X' | 'O';

export type BoardState = (PlayerToken | null)[];

import { NewRoom } from './validators'

export type GameState = {
    boardState: BoardState;
    turn: number;
    winner?: PlayerToken | 'draw'
}

export type Player = {
    token: PlayerToken;
    name: string;
    status: PlayerStaus;
}

export default class Room {
    name: string;
    isPrivate: boolean;
    password?: string;

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

    private getPlayerByName(name: string) {
        if (this.playerX?.name === name) {
            return this.playerX
        }

        if (this.playerO?.name === name) {
            return this.playerO;
        }

        return null;
    }

    private isPlayersTurn(playerToken: PlayerToken) {
        if (playerToken === 'X' && this.turn % 2 === 0) {
            return true;
        }

        if (playerToken === 'O' && this.turn % 2 === 1) {
            return true;
        }

        return false;
    }

    getRoomInfo() {
        const playerNum = 0 + (this.playerX ? 1 : 0) + (this.playerO ? 1 : 0);
        return {
            name: this.name,
            isPrivate: this.isPrivate,
            players: playerNum
        }
    }

    addPlayer(playerName: string, providedPassword?: string): Player | RoomFullException | InvalidPasswordException {
        const player = this.getPlayerByName(playerName);
        if (player) {
            return { ...player, status: 'CONNECTED' }
        }
        
        if (this.playerX && this.playerO) {
            return new RoomFullException("Room is full!");
        }

        if (this.password && this.password !== providedPassword) {
            return new InvalidPasswordException("Invalid password!");
        }

        if (!this.playerX) {
            const newPlayer: Player = { token: 'X', name: playerName, status: 'CONNECTED' };
            this.playerX = newPlayer;
            return newPlayer;
        } else {
            const newPlayer: Player = { token: 'O', name: playerName, status: 'CONNECTED' };
            this.playerO = newPlayer;
            return newPlayer;
        }
    }

    removePlayer(playerName: string): Player | NotAPLayerException {
        const player = this.getPlayerByName(playerName);

        if (!player) {
            return new NotAPLayerException("Not a player!");
        }

        player.token === 'X' 
            ? this.playerX = undefined
            : this.playerO = undefined;

        return {...player, status: 'DISCONNECTED'}
    }

    getGameState(): GameState {
        return {
            boardState: this.boardState,
            turn: this.turn,
            winner: this.winner
        }
    }

    changeGameState(playerName: string, changedTileIndex: number): GameState | NotAPLayerException | InvalidMoveException {
        const player = this.getPlayerByName(playerName);

        if (!player) {
            return new NotAPLayerException("Not a player!");
        }

        if (!this.isPlayersTurn(player.token)) {
            return new InvalidMoveException("Not a player's turn!");
        }

        if (this.boardState[changedTileIndex] !== null) {
            return new InvalidMoveException("Tile was already changed!");
        }

        this.boardState[changedTileIndex] = player.token;
        this.turn++;
        this.checkForWinner();

        return { boardState: this.boardState, turn: this.turn };
    }

    checkForWinner() {
        const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // lines
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6],            // diagonal
        ];

        if (this.turn === 9) {
            this.winner = "draw";
            return true;
        }

        for (const line of winningLines) {
            const firstElem = this.boardState[line[0]];
            const checkLine = line.every(index => {
                return firstElem && this.boardState[index] === firstElem
            });

            console.log("Line:", line, " is ", checkLine);
            if (checkLine && firstElem) {
                this.winner = firstElem;
                return;
            }
        }
          
        return;
    }
}
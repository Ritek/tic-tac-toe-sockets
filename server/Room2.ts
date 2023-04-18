import { RoomFullException, InvalidMoveException, NotAPLayerException, InvalidPasswordException } from './types';

export type PlayerStaus = 'CONNECTED' | 'INACTIVE' | 'DISCONNECTED';

export type PlayerToken = 'X' | 'O';

export type BoardState = (PlayerToken | null)[];

export type GameState = {
    board: BoardState;
    turn: number;
    winner?: PlayerToken
}

export type Player = {
    token: PlayerToken;
    name: string;
    status: PlayerStaus;
}

export default class Room2 {
    name: string;
    isPrivate: boolean;
    password?: string;

    turn: number;
    boardState: BoardState;

    playerX?: Player;
    playerO?: Player;
    // players?: Map<string, Player>

    winner?: PlayerToken;

    constructor(name: string, isPrivate: false);
    constructor(name: string, isPrivate: true, password: string);
    constructor(name: string, isPrivate: boolean, password?: string) {
        this.name = name;
        this.isPrivate = isPrivate;
        this.password = password;
        this.turn = 0;
        this.boardState = new Array(9).fill(null);
    }

    private getTokenByPlayerName(name: string): PlayerToken {
        return this.playerX?.name === name ? 'X' : 'O';
    }

    getRoomInfo() {
        const playerNum = 0 + (this.playerX ? 1 : 0) + (this.playerO ? 1 : 0);
        return {
            name: this.name,
            isPrivate: this.isPrivate,
            players: playerNum
        }
    }

    /* canPlayerJoin(providedPassword?: string): true | RoomFullException | InvalidPasswordException {
        if (this.playerX && this.playerO) {
            return new RoomFullException("Room is full!");
        }

        if (this.password && this.password !== providedPassword) {
            return new InvalidPasswordException("Invalid password!");
        }

        return true;

        switch (!this.playerX || !this.playerO) {
            case (!this.playerX):
                this.playerX = newPlayer;
                return newPlayer;

            case (!this.playerO):
                this.playerO = newPlayer;
                return newPlayer;
        }

    } */

    addPlayer(playerName: string, providedPassword?: string): Player | RoomFullException | InvalidPasswordException {
        if (this.playerX?.name === playerName) {
            return { token: 'X', name: playerName, status: 'CONNECTED' };
        }

        if (this.playerO?.name === playerName) {
            return { token: 'O', name: playerName, status: 'CONNECTED' };
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
        if (this.playerX?.name === playerName) {
            const removedPlayer: Player = {...this.playerX, status: 'DISCONNECTED'};
            this.playerX = undefined;
            return removedPlayer;
        }

        if (this.playerO?.name === playerName) {
            const removedPlayer: Player = {...this.playerO, status: 'DISCONNECTED'};
            this.playerO = undefined;
            return removedPlayer;
        }

        return new NotAPLayerException("Not a player!");
    }

    changeGameState(playerName: string, changedTileIndex: number): GameState | NotAPLayerException | InvalidMoveException {
        if (this.playerX?.name !== playerName || 
                this.playerO?.name !== playerName) {
            return new NotAPLayerException("Not a player!");
        }

        if (this.boardState[changedTileIndex] !== null) {
            return new InvalidMoveException("Tile was already changed!");
        }

        const token = this.getTokenByPlayerName(playerName);
        this.boardState[changedTileIndex] = token;
        this.turn++;

        return { board: this.boardState, turn: this.turn };
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class Room {
    constructor(params) {
        this.name = params.name;
        this.isPrivate = params.isPrivate;
        this.password = params.password;
        this.turn = 0;
        this.boardState = new Array(9).fill(null);
    }
    getPlayerByName(name) {
        var _a, _b;
        if (((_a = this.playerX) === null || _a === void 0 ? void 0 : _a.name) === name) {
            return this.playerX;
        }
        if (((_b = this.playerO) === null || _b === void 0 ? void 0 : _b.name) === name) {
            return this.playerO;
        }
        return null;
    }
    isPlayersTurn(playerToken) {
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
        };
    }
    addPlayer(playerName, providedPassword) {
        const player = this.getPlayerByName(playerName);
        if (player) {
            return Object.assign(Object.assign({}, player), { status: 'CONNECTED' });
        }
        if (this.playerX && this.playerO) {
            return new types_1.RoomFullException("Room is full!");
        }
        if (this.password && this.password !== providedPassword) {
            return new types_1.InvalidPasswordException("Invalid password!");
        }
        if (!this.playerX) {
            const newPlayer = { token: 'X', name: playerName, status: 'CONNECTED' };
            this.playerX = newPlayer;
            return newPlayer;
        }
        else {
            const newPlayer = { token: 'O', name: playerName, status: 'CONNECTED' };
            this.playerO = newPlayer;
            return newPlayer;
        }
    }
    removePlayer(playerName) {
        const player = this.getPlayerByName(playerName);
        if (!player) {
            return new types_1.NotAPLayerException("Not a player!");
        }
        player.token === 'X'
            ? this.playerX = undefined
            : this.playerO = undefined;
        return Object.assign(Object.assign({}, player), { status: 'DISCONNECTED' });
    }
    getGameState() {
        return {
            boardState: this.boardState,
            turn: this.turn,
            winner: this.winner
        };
    }
    changeGameState(playerName, changedTileIndex) {
        const player = this.getPlayerByName(playerName);
        if (!player) {
            return new types_1.NotAPLayerException("Not a player!");
        }
        if (!this.isPlayersTurn(player.token)) {
            return new types_1.InvalidMoveException("Not a player's turn!");
        }
        if (this.boardState[changedTileIndex] !== null) {
            return new types_1.InvalidMoveException("Tile was already changed!");
        }
        this.boardState[changedTileIndex] = player.token;
        this.turn++;
        this.checkForWinner();
        return { boardState: this.boardState, turn: this.turn };
    }
    checkForWinner() {
        const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6], // diagonal
        ];
        if (this.turn === 9) {
            this.winner = "draw";
            return true;
        }
        for (const line of winningLines) {
            const firstElem = this.boardState[line[0]];
            const checkLine = line.every(index => {
                return firstElem && this.boardState[index] === firstElem;
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
exports.default = Room;

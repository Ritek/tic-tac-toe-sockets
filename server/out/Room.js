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
    getPlayerByID(userID) {
        return [this.playerX, this.playerO].find(player => (player === null || player === void 0 ? void 0 : player.userID) === userID);
    }
    isPlayersTurn(playerToken) {
        return (playerToken === 'X' && this.turn % 2 === 0)
            || (playerToken === 'O' && this.turn % 2 === 1);
    }
    getRoomInfo() {
        const playerNum = 0 + (this.playerX ? 1 : 0) + (this.playerO ? 1 : 0);
        return {
            name: this.name,
            isPrivate: this.isPrivate,
            players: playerNum
        };
    }
    addPlayer(userID, username, providedPassword) {
        const player = this.getPlayerByID(userID);
        if (player) {
            player.connected = true;
            return Object.assign(Object.assign({}, player), { connected: true });
        }
        if (this.playerX && this.playerO) {
            return new types_1.RoomFullException("Room is full!");
        }
        if (this.password && this.password !== providedPassword) {
            return new types_1.InvalidPasswordException("Invalid password!");
        }
        if (!this.playerX) {
            const newPlayer = { token: 'X', userID, username, connected: true };
            this.playerX = newPlayer;
            return newPlayer;
        }
        else {
            const newPlayer = { token: 'O', userID, username, connected: true };
            this.playerO = newPlayer;
            return newPlayer;
        }
    }
    removePlayer(userID) {
        const player = this.getPlayerByID(userID);
        console.log(player);
        if (!player) {
            console.log("Not a player!");
            return new types_1.NotAPLayerException("Not a player!");
        }
        player.token === 'X'
            ? this.playerX = undefined
            : this.playerO = undefined;
        console.log(this.playerX, this.playerO);
        this.resetGameState();
        return Object.assign(Object.assign({}, player), { connected: false });
    }
    updatePlayerStatus(userID, status) {
        const player = [this.playerX, this.playerO].find(player => (player === null || player === void 0 ? void 0 : player.userID) === userID);
        if (!player)
            return new types_1.NotAPLayerException("Not a player!");
        const newStatus = status === 'connected';
        player.connected = newStatus;
        return player;
    }
    getOtherPlayer(userID) {
        const player = this.getPlayerByID(userID);
        if (!player) {
            return new types_1.NotAPLayerException("Not a player!");
        }
        if (this.playerX && this.playerO) {
            return [this.playerX, this.playerO].find(player => (player === null || player === void 0 ? void 0 : player.userID) !== userID);
        }
        else {
            return undefined;
        }
    }
    getGameState() {
        return {
            players: {
                playerX: this.playerX,
                playerO: this.playerO
            },
            boardState: this.boardState,
            turn: this.turn,
            winner: this.winner
        };
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
    changeGameState(userID, changedTileIndex) {
        const player = this.getPlayerByID(userID);
        if (!player) {
            return new types_1.NotAPLayerException("Not a player!");
        }
        if (!this.isPlayersTurn(player.token)) {
            return new types_1.InvalidMoveException("Not a player's turn!");
        }
        if (!this.playerX || !this.playerO) {
            return new types_1.InvalidMoveException("Missing oponent!");
        }
        if (this.boardState[changedTileIndex] !== null) {
            return new types_1.InvalidMoveException("Tile was already changed!");
        }
        this.boardState[changedTileIndex] = player.token;
        this.turn++;
        this.checkForWinner();
        return this.getGameState();
    }
    checkForWinner() {
        const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6], // diagonal
        ];
        for (const line of winningLines) {
            const firstElem = this.boardState[line[0]];
            const checkLine = line.every(index => firstElem && this.boardState[index] === firstElem);
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
exports.default = Room;

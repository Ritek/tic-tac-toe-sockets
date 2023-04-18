"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
class Room2 {
    constructor(name, isPrivate, password) {
        this.name = name;
        this.isPrivate = isPrivate;
        this.password = password;
        this.turn = 0;
        this.boardState = new Array(9).fill(null);
    }
    getTokenByPlayerName(name) {
        var _a;
        return ((_a = this.playerX) === null || _a === void 0 ? void 0 : _a.name) === name ? 'X' : 'O';
    }
    getRoomInfo() {
        const playerNum = 0 + (this.playerX ? 1 : 0) + (this.playerO ? 1 : 0);
        return {
            name: this.name,
            isPrivate: this.isPrivate,
            players: playerNum
        };
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
    addPlayer(playerName, providedPassword) {
        var _a, _b;
        if (((_a = this.playerX) === null || _a === void 0 ? void 0 : _a.name) === playerName) {
            return { token: 'X', name: playerName, status: 'CONNECTED' };
        }
        if (((_b = this.playerO) === null || _b === void 0 ? void 0 : _b.name) === playerName) {
            return { token: 'O', name: playerName, status: 'CONNECTED' };
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
        var _a, _b;
        if (((_a = this.playerX) === null || _a === void 0 ? void 0 : _a.name) === playerName) {
            const removedPlayer = Object.assign(Object.assign({}, this.playerX), { status: 'DISCONNECTED' });
            this.playerX = undefined;
            return removedPlayer;
        }
        if (((_b = this.playerO) === null || _b === void 0 ? void 0 : _b.name) === playerName) {
            const removedPlayer = Object.assign(Object.assign({}, this.playerO), { status: 'DISCONNECTED' });
            this.playerO = undefined;
            return removedPlayer;
        }
        return new types_1.NotAPLayerException("Not a player!");
    }
    changeGameState(playerName, changedTileIndex) {
        var _a, _b;
        if (((_a = this.playerX) === null || _a === void 0 ? void 0 : _a.name) !== playerName ||
            ((_b = this.playerO) === null || _b === void 0 ? void 0 : _b.name) !== playerName) {
            return new types_1.NotAPLayerException("Not a player!");
        }
        if (this.boardState[changedTileIndex] !== null) {
            return new types_1.InvalidMoveException("Tile was already changed!");
        }
        const token = this.getTokenByPlayerName(playerName);
        this.boardState[changedTileIndex] = token;
        this.turn++;
        return { board: this.boardState, turn: this.turn };
    }
}
exports.default = Room2;

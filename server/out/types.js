"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameDuplicateException = exports.NotAPLayerException = exports.InvalidMoveException = exports.InvalidPasswordException = exports.RoomFullException = void 0;
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class RoomFullException extends CustomError {
}
exports.RoomFullException = RoomFullException;
;
class InvalidPasswordException extends CustomError {
}
exports.InvalidPasswordException = InvalidPasswordException;
;
class InvalidMoveException extends CustomError {
}
exports.InvalidMoveException = InvalidMoveException;
;
class NotAPLayerException extends CustomError {
}
exports.NotAPLayerException = NotAPLayerException;
;
class NameDuplicateException extends CustomError {
}
exports.NameDuplicateException = NameDuplicateException;
;

class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class RoomFullException extends CustomError {};
export class InvalidPasswordException extends CustomError {};
export class InvalidMoveException extends CustomError {};
export class NotAPLayerException extends CustomError {};
export class NameDuplicateException extends CustomError {};
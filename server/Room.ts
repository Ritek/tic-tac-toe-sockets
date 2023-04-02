export default class Room {
  finished: boolean;
  winner?: string;
  turn: number;

  name: string;
  privateRoom: boolean;
  gameState: (string | null)[];

  playerX?: string;
  playerO?: string;

  constructor(name: string, privateRoom: boolean = false, playerX = undefined, playerO = undefined) {
    this.finished = false;
    this.winner = undefined;
    this.turn = 0;

    this.name = name;
    this.privateRoom = privateRoom;
    this.gameState = new Array<string | null>(9).fill(null);

    this.playerX = playerX;
    this.playerO = playerO;
  }

  addPlayer(player: string) {
    if (!this.playerX) {
      this.playerX = player;
      return;
    }

    if (!this.playerO) {
      this.playerO = player;
      return;
    }
  }

  removePlayer(player: string) {
    if (this.playerX === player) {
      this.playerX = undefined;
      return;
    }

    if (this.playerO === player) {
      this.playerO = undefined;
      return;
    }
  }

  isEmpty() {
    return !this.playerX && !this.playerO;
  }

  twoPlayerPresent() {
    if (this.playerX && this.playerO) return true;
  }

  canJoinRoom() {
    // if (this.playerX && !this.playerO) return true;
    // if (!this.playerX && this.playerO) return true;
    // return false;

    return !this.playerX || !this.playerO;
  }

  isPlayersTurn(player: string) {
    if (player === this.playerX && this.turn % 2 === 0) return true;
    if (player === this.playerO && this.turn % 2 === 1) return true;
    return false;
  }

  changeGameState(player: string, index: number) {
    if (this.playerX === player && this.gameState[index] === null) {
      this.gameState[index] = 'X';
      this.turn++;
      return;
    }
    if (this.playerO === player && this.gameState[index] === null) {
      this.gameState[index] = 'O';
      this.turn++;
      return;
    }
  }

  checkGameOver() {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];
    winningLines.forEach(line => {
      if (line[0] && line[0] === line[1] && line[0] === line[2]) {
        this.winner = this.gameState[line[0]] === 'X' ? 'player X' : 'player O';
        this.finished = true;
        return true;
      }
    });

    if (this.turn === 9) return true;
    return false;
  }

  resetGameState() {
    this.turn = 0;
    [this.playerX, this.playerO] = [this.playerO, this.playerX];
    this.gameState = this.gameState.fill(null);
    this.finished = true;
  }

}
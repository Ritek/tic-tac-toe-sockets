export default class Room {
  finished: boolean;
  winner?: string;
  turn: number;

  name: string;
  isPrivateRoom: boolean;
  gameState: (string | null)[];

  playerX?: string;
  playerO?: string;

  constructor(name: string, privateRoom: boolean = false, playerX = undefined, playerO = undefined) {
    this.finished = false;
    this.winner = undefined;
    this.turn = 0;

    this.name = name;
    this.isPrivateRoom = privateRoom;
    this.gameState = new Array<string | null>(9).fill(null);

    this.playerX = playerX;
    this.playerO = playerO;
  }

  getBasicInfo() {
    return {
      name: this.name,
      isPrivate: this.isPrivateRoom
    }
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

  isEmpty = () => !this.playerX && !this.playerO;
  canJoinRoom = () => !this.playerX || !this.playerO;
  twoPlayerPresent = () => this.playerX && this.playerO
  isValidMove = (moveIndex: number) => this.gameState[moveIndex] === null;

  isPlayersTurn(player: string) {
    if (player === this.playerX && this.turn % 2 === 0) return true;
    if (player === this.playerO && this.turn % 2 === 1) return true;
    return false;
  }

  changeGameState(player: string, index: number) {
    const playerChar = this.playerX === player ? 'X' : 'O';
    if (this.gameState[index] === null) {
      this.gameState[index] = playerChar;
      this.turn++;
    }
  }

  private checkLine(line: number[]) {
    if (this.gameState[line[0]] 
        && this.gameState[line[0]] === this.gameState[line[1]] 
        && this.gameState[line[0]] === this.gameState[line[2]]
    ) {
      this.winner = this.gameState[line[0]] === 'X' ? 'player X' : 'player O';
      this.finished = true;
      return true;
    } 
    
    return false;
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

    if (this.turn === 9) {
      this.winner = "draw";
      this.finished = true;
      return true;
    }

    for (const line of winningLines) {
      console.log("Line:", line, " is ", this.checkLine(line));
      if (this.checkLine(line)) return true;
    }
    
    return false;
  }

  resetGameState() {
    this.turn = 0;
    [this.playerX, this.playerO] = [this.playerO, this.playerX];
    this.gameState = this.gameState.fill(null);
    this.finished = true;
  }

}
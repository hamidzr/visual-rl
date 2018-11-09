const assert = require('assert'),
  Game = require('./Game.js');

// TODO rename cols to cols

const TERMINAL_SYMBOL='[T]';
const PLAYER_SYMBOL='[P]';
const EMPTY_SYMBOL='[ ]';

class GridWorld extends Game {
  constructor(rows=4, cols=4) {
    super();

    this.grid = Array(rows).fill(null).map(() => {
      return Array(cols).fill(EMPTY_SYMBOL);
    });

    this.rows = rows;
    this.cols = cols;

    this.reset();
  }

  _markCellTerminal(row, col) {
    this.grid[row][col] = TERMINAL_SYMBOL;
    // TODO no tuples in js, add list instead to the terminalCells?
    for (let i = 0; i < this.terminalCells.length; ++i) {
      if (this.terminalCells[i][0] === row && this.terminalCells[i][1] === col) {
        // Maintain uniqueness of (row,col) in terminalCells
        return;
      }
      this.terminalCells.push([row, col]);
    }
  }

  _setPlayerAt(row, col) {
    // TODO validation checks?
    if (row > this.rows-1 || col > this.cols-1 || row < 0 || col < 0) {
      throw new Error(`invalid location ${row} ${col}`);
    }
    this._pLoc = [row, col];
  }

  _isOver() {
    for (let i = 0; i < this.terminalCells.length; ++i) {
      if (this._pLoc[0] === this.terminalCells[i][0] && this._pLoc[1] === this.terminalCells[i][1]) {
        return true;
      }
    }
    return false;
  }

  state() {
    let row = this._pLoc[0];
    let col = this._pLoc[1];
    //TODO can add rowColToIndex util function if desired
    return row * this.cols + col;
  }

  show() {
    for (let i = 0; i < this.grid.length; ++i) {
      let disp_line = '';
      for (let j = 0; j < this.grid[i].length; ++j) {
        let symbol = this.grid[i][j];
        if (i === this._pLoc[0] && j === this._pLoc[1]) {
          symbol = PLAYER_SYMBOL;
        }
        disp_line += symbol;
      }
      console.log(disp_line);
    }
  }

  // initializes or resets the game
  reset() {
    // TODO syntax check

    const rows = this.rows;
    const cols = this.cols;

    this.terminalCells = [];

    // put player at init location
    this._pLoc = [rows-1, cols-1];
    this._setPlayerAt(rows-1, 0);

    this._markCellTerminal(0, 0);
    this._markCellTerminal(rows-1, cols-1);
  }

  // 0, 1, 2, 3 = up, down, right, left
  act(action) {
    let y = this._pLoc[0];
    let x = this._pLoc[1];


    // CHECK
    try {
      if (action === 0) this._setPlayerAt(y-1, x);
      if (action === 1) this._setPlayerAt(y+1, x);
      if (action === 2) this._setPlayerAt(y, x+1);
      if (action === 3) this._setPlayerAt(y, x-1);
    } catch (e) {
      // stay in the same cell
    }

    this.last_action = action;
  }

  feedback() {
    let reward = -1;
    let is_over = this._isOver();
    if (is_over)
      reward = +1;
    return [reward, is_over];
  }
}


g = new GridWorld();
assert(g.state() === 12);
g.act(0);
assert(g.state() === 8);
g.act(2);
assert(g.state() === 9);
g.show();


module.exports = GridWorld;

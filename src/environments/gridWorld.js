const TERMINAL_SYMBOL='[T]';
const PLAYER_SYMBOL='[P]';
const EMPTY_SYMBOL='[ ]';

class GridWorld extends Game {
  constructor(rows=4, columns=4) {
    for (let i = 0; i < columns; ++i) {
    }
    
    this.grid = [[EMPTY_SYMBOL for i in range(0, columns)] for item in range(0, rows)]
    this.rows = rows;
    this.columns = columns;
    this.terminalCells = [];

    // put player at init location
    this._pLoc = (rows-1, columns-1)
    this._setPlayerAt(rows-1, 0)

    this._markCellTerminal(0, 0)
    this._markCellTerminal(rows-1, columns-1)
  }

  _markCellTerminal(row, column) {
    this.grid[row][column] = TERMINAL_SYMBOL;
    // TODO no tuples in js, add list instead to the terminalCells?
    for (let i = 0; i < this.terminalCells.length; ++i) {
      if (this.terminalCells[i][0] === row && this.terminalCells[i][1] === column) {
      // Maintain uniqueness of (row,column) in terminalCells
      return;
    }
      this.terminalCells.push([row, column]);
  }

  _setPlayerAt(row, column) {
    // TODO validation checks?
    if (row > this.rows-1 || column > this.columns-1 or row < 0 or column < 0):
      throw new Error(`invalid location ${row} ${column}`);
    this._pLoc = (row, column);
  }

  _isOver() {
    for (let i = 0; i < this.terminalCells.length; ++i) {
      if (this._pLoc[0] == this.terminalCells[i][0] && this._pLoc[1] == this.terminalCells[i][1]) {
        return true;
      }
    }
    return false;
  }

  state() {
    let row = this._pLoc[0];
    let col = this._pLoc[1];
    //TODO can add rowColToIndex util function if desired
    return row * this.columns + col;
  }

  // TODO do we need this show function for js version?
  show() {
    for (let i = 0; i < this.grid.length; ++i) {
      for (let j = 0; i < grid[i].length; ++j) {
        let symbol = this.grid[i][j];
        if (i == this._pLoc[0] && j = this._pLoc[1]) {
          symbol = PLAYER_SYMBOL;
        }
        console.log(symbol);
      }
      //TODO Is this wrong when using console.log? Newlines included?
      console.log('\n');
    }
  }

  reset() {
    // TODO syntax check
    this.constructor(this.grid.length, this.grid[0].length);
  }

  // 0, 1, 2, 3 = up, down, right, left
  act(action) {
    let y = this._pLoc[0];
    let x = this._pLoc[1];

    // CHECK
    try {
      if action == 0: self._setPlayerAt(y-1, x)
      if action == 1: self._setPlayerAt(y+1, x)
      if action == 2: self._setPlayerAt(y, x+1)
      if action == 3: self._setPlayerAt(y, x-1)
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
    return [reward, is_over]
  }
}


if __name__ == '__main__':
  g = GridWorld()
  assert(g.state() == 12)
  g.act(0)
  assert(g.state() == 8)
  g.act(2)
  assert(g.state() == 9)
  g.show()

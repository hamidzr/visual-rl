#!/bin/env python
from environments.Game import Game
from utils.helpers import rowColToIndex
import sys

TERMINAL_SYMBOL='[T]'
PLAYER_SYMBOL='[P]'
EMPTY_SYMBOL='[ ]'

class GridWorld(Game):
  def __init__(self, rows=4, columns=4):
    self.grid = [[EMPTY_SYMBOL for i in range(0, columns)] for item in range(0, rows)]
    self.rows = rows
    self.columns = columns
    self.terminalCells = set()

    # put player at init location
    self._pLoc = (rows-1, columns-1)
    self._setPlayerAt(rows-1, 0)

    self._markCellTerminal(0, 0)
    self._markCellTerminal(rows-1, columns-1)

  def _markCellTerminal(self, row, column):
    self.grid[row][column] = TERMINAL_SYMBOL
    self.terminalCells.add((row, column))

  def _setPlayerAt(self, row, column):
    # TODO validation checks?
    if (row > self.rows-1 or column > self.columns-1 or row < 0 or column < 0):
      raise Exception('invalid location', row, column)
    self._pLoc = (row, column)

  def _isOver(self):
    return self._pLoc in self.terminalCells

  def state(self):
    (row, col) = self._pLoc
    return rowColToIndex(row, col, self.columns)

  def show(self):
    for i, row in enumerate(self.grid):
      for j, cell in enumerate(row):
        symbol = self.grid[i][j]
        if ((i,j) == self._pLoc): symbol = PLAYER_SYMBOL
        sys.stdout.write(symbol)
      sys.stdout.write('\n')

    sys.stdout.flush()

  def reset(self):
    self.__init__(rows=len(self.grid), columns=len(self.grid[0]))

  # 0, 1, 2, 3 = up, down, right, left
  def act(self, action):
    (y, x) = self._pLoc

    # CHECK
    try:
      if action == 0: self._setPlayerAt(y-1, x)
      if action == 1: self._setPlayerAt(y+1, x)
      if action == 2: self._setPlayerAt(y, x+1)
      if action == 3: self._setPlayerAt(y, x-1)
    except Exception as e:
      # stay in the same cell
      pass

    self.last_action = action

  def feedback(self):
    reward = -1
    is_over = self._isOver()
    if is_over: reward = +1
    return reward, is_over




if __name__ == '__main__':
  g = GridWorld()
  assert(g.state() == 12)
  g.act(0)
  assert(g.state() == 8)
  g.act(2)
  assert(g.state() == 9)
  g.show()

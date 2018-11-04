import math

def indexToRowCol(idx, columns):
  row = math.floor(idx / columns)
  col = idx % columns
  return (row, col)

def rowColToIndex(row, col, columns):
  return row*columns + col

FOUR_DIRS_WORD = ['UP', 'DOWN', 'RIGHT', 'LEFT']
FOUR_DIRS_ARROW = ['↑', '↓', '→', '←']
FOUR_DIRS = zip(FOUR_DIRS_WORD, FOUR_DIRS_ARROW)

# define an enum?
ACTION_MAP = {
  'UP': 0,
  'DOWN': 1,
  'RIGHT': 2,
  'LEFT': 3,
}


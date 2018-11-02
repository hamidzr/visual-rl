import numpy as np
import random

class QLearner:
  def __init__(self, state_size, action_size, discount_factor=0.9, update_rate=0.1, epsilon=0.2):
    # QUESTION should I have it this way or rotated?
    self._qTable = np.random.rand(state_size, action_size) #state, action value
    self.state_size = state_size
    self.action_size = action_size
    self.discount_factor = discount_factor # gamma
    self.update_rate = update_rate # alpha
    self.epsilon = epsilon

  # getQ
  def q(self, state, action):
    return self._qTable[state][action]

  def _setQ(self, state, action, value):
    self._qTable[state][action] = value

  # returns the best acitions
  def _best_actions(self, state):
    assert state < self.state_size
    max_value = max(self._qTable[state])
    return [i for i, j in enumerate(self._qTable[state]) if j == max_value ]

  def best_action(self, state):
    best_actions = self._best_actions(state)
    return random.choice(best_actions)

  def act(self, state):
    action = None
    if np.random.rand() <= self.epsilon:
      action = random.randrange(self.action_size)
    else:
      action = self.best_action(state)
    assert action < self.action_size
    assert action >= 0
    return action

  def update(self, state, action, reward, next_state):
    # compute the difference
    best_next_action = self.best_action(next_state)
    best_next_value = self.q(next_state, best_next_action)
    diff = reward + (self.discount_factor * best_next_value) - self.q(state, action)

    # compute the update
    new_value = self.q(state, action) + self.update_rate * diff

    # do the update
    self._setQ(state, action, new_value)

class Agent:
  def __init__(self, qLearner, game):
    self.ql = qLearner
    self.game = game

  def play_episode(self):
    self.game.reset()
    state = self.game.state()
    is_over = False

    while not is_over:
      action = self.ql.act(state)
      self.game.act(action)
      next_state = self.game.state()
      reward, is_over = self.game.feedback()
      self.ql.update(state, action, reward, next_state)
      state = next_state
      yield reward

  def play_n_episodes(self, n):
    for episode in range(n):
      total_reward = 0
      for reward in self.play_episode():
        total_reward += reward
      yield total_reward

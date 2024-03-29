from abc import ABC, abstractmethod

# a wrapper abstract class to help prepare the game for learning
# abstrat methods must be present on the children
class Game(ABC):
  def __init__(self, base_game=None):
    # TODO check this might not be set properly
    self.game = base_game
    super(Game, self).__init__()

  @abstractmethod
  def state(self):
    pass

  # @abstractmethod
  # def step(self, action):
  #   # self.act(action)
  #   # wait for the other player to do its thing
  #   # new_state, reward, isDone, info = self.get_feedback()
  #   pass

  @abstractmethod
  def show(self):
    pass

  @abstractmethod
  def reset(self):
    pass

  @abstractmethod
  def act(self, action):
    self.last_action = action
    pass

  # run once after an action to get action's feedback
  @abstractmethod
  def feedback(self):
    pass

  # runs some generic tests to ensure the interface is implemented correctly
  def test(self):
    assert self.state().shape, 'state has to return a numpy array'
    assert self.state().shape[0] == 1, f'bad state shape {self.state().shape}'
    # TODO safety check for going out of order (roles)


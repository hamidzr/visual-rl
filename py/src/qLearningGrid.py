from environments.gridWorld import GridWorld
from utils.helpers import ACTION_MAP, FOUR_DIRS_ARROW
from utils.visualize import plot_linear_ys, plt
from QLearner import QLearner, Agent
import numpy as np

ROWS=4
COLUMNS=4
ACTIONS=4

STATE_SIZE=ROWS*COLUMNS

# setup the game
game = GridWorld(rows=4, columns=4)


def run_experiment(simulation_fn, simulation_count):
  # run an experiment

  # run the simulations and capture the rewards history
  simulations_results = []
  for sim in range(simulation_count):
    print('starting simulation #', sim, '..')
    simulations_results.append(simulation_fn())

  # average the rewards history
  simulations_results = np.array(simulations_results)
  rewards_avg = np.average(simulations_results, axis=0)

  return rewards_avg


SIMULATIONS = 5
EXP1_EPISODES = int(1e+2)
EXP2_EPISODES = int(1e+2)

def experiment1_simulation():
  # runs a simulation for experiment one

  # setup the qlearner
  ql = QLearner(STATE_SIZE, ACTIONS, discount_factor=0.9, update_rate=0.1, epsilon=0.25)
  agent = Agent(ql, game)


  # set q(s,a) for terminal states to 0 # WHY?
  TERMINAL_STATES=set([0, STATE_SIZE-1])
  for state in TERMINAL_STATES:
    for act in range(ql.action_size):
      ql._setQ(state, act, 0)


  rewards_history = []
  for episode, total_reward in enumerate(agent.play_n_episodes(EXP1_EPISODES)):
    rewards_history.append(total_reward)
    print(f'episode {episode} done with epsilon{ql.epsilon} rewards: {total_reward}')
  return rewards_history

def experiment2_simulation():
  # runs a simulation for experiment one

  # setup the qlearner
  ql = QLearner(STATE_SIZE, ACTIONS, discount_factor=0.9, update_rate=0.1, epsilon=1)
  agent = Agent(ql, game)

  # set q(s,a) for terminal states to 0 # WHY?
  TERMINAL_STATES=set([0, STATE_SIZE-1])
  for state in TERMINAL_STATES:
    for act in range(ql.action_size):
      ql._setQ(state, act, 0)


  rewards_history = []
  for episode in range(EXP2_EPISODES):
    total_reward = 0
    for step, reward in enumerate(agent.play_episode()):
      ql.update_rate = 1.0 / (episode+1)
      ql.epsilon = 1.0 / (episode+1)
      total_reward += reward
    print(f'episode {episode} done with epsilon{ql.epsilon} rewards: {total_reward}')
    rewards_history.append(total_reward)
  return rewards_history


exp1_rewards_avg = run_experiment(experiment1_simulation, SIMULATIONS)
plt.plot([0, EXP1_EPISODES], [-1, -1])
plot_linear_ys(exp1_rewards_avg, fname='gridw-ql-exp1',
               title='experiment one',
               xlabel='episodes',
               ylabel=f'total rewards (avg of {SIMULATIONS} simulations)')

plt.plot([0, EXP2_EPISODES], [-1, -1])
exp2_rewards_avg = run_experiment(experiment2_simulation, SIMULATIONS)
plot_linear_ys(exp2_rewards_avg, fname='gridw-ql-exp2',
               title='experiment two',
               xlabel='episodes',
               ylabel=f'total rewards (avg of {SIMULATIONS} simulations)',
               color='g')

OFFSET = 3
plot_linear_ys(exp1_rewards_avg, color='b', label='experiment one', offset=OFFSET)
plot_linear_ys(exp2_rewards_avg, color='g', offset=OFFSET,
               fname='gridw-ql', title=f'QLearner Experiments (offset={OFFSET})',
               xlabel='episodes', ylabel=f'total rewards (avg of {SIMULATIONS} simulations)',
               label='experiment two')

// learns to play the grid world game using a tabular qlearner

const GridWorld = require('./environments/gridWorld.js'),
  TabularQLeaner = require('./TabularQLAgent.js'),
  Player = require('./Player.js');

const ROWS=4;
const COLUMNS=4;
const ACTIONS=4;

const STATE_SIZE=ROWS*COLUMNS;

// setup the game
game = new GridWorld(ROWS, COLUMNS);


function run_experiment(simulation_fn, simulation_count) {
  // run an experiment

  // run the simulations and capture the rewards history
  simulations_results = [];
  for (let sim=0; sim < simulation_count; sim++) {
    console.log('starting simulation #', sim, '..');
    simulations_results.push(simulation_fn());
  }

  // average the rewards history
  // rewards_avg = np.average(simulations_results, axis=0)

  return simulations_results;
}


const SIMULATIONS = 5;
const EXP1_EPISODES = 1e+5;
const EXP2_EPISODES = 1e+2;

function experiment1_simulation() {
  // runs a simulation for experiment one

  // setup the qlearner
  const agent = new TabularQLeaner({
    stateSize: STATE_SIZE,
    actionSize: ACTIONS,
    discountRate: 0.9,
    updateRate: 0.1,
    epsilon: 0.10,
  });

  const player = new Player(agent, game);

  // set q(s,a) for terminal states to 0 # WHY?
  TERMINAL_STATES = [0, STATE_SIZE-1];
  TERMINAL_STATES.forEach(state => {
    for (let act=0; act < agent.action_size; act++) {
      agent._setQ(state, act, 0);
    }
  });


  rewards_history = [];
  playResults = player.play_n_episodes(EXP1_EPISODES);
  rewards_history.push(playResults);
  return rewards_history;
}

exp1_rewards = run_experiment(experiment1_simulation, SIMULATIONS);

class QLearner {
  constructor(state_size, action_size, discount_factor=0.9, update_rate=0.1, epsilon=0.2) {
    // QUESTION should I have it this way or rotated?
    // Create qTable and fill with random numbers
    this._qTable = [];
    for (var state = 0; state <= state_size; ++state) {
      var action_array = [];
      for (var action = 0; action <= action_size; ++action) {
        action_array.push(Math.random());
      }
        this._qTable.push(action_array);
    }
    this.state_size = state_size;
    this.action_size = action_size;
    this.discount_factor = discount_factor; // gamma
    this.update_rate = update_rate; // alpha
    this.epsilon = epsilon;
  }

  // getQ
  q(, state, action) {
    return this._qTable[state][action];
  }

  _setQ(state, action, value) {
    this._qTable[state][action] = value;
  }

  // Since the "utils.indexOfMax" function only returns one action
  // we don't need the _best_actions/best_action combo
  // If this isn't "random enough" in the case of a tie,
  // we can modify how indexOfMax handles ties
  best_action(state) {
    if (state >= this.state_size) throw new Error(`Invalid choice of state: ${state}. Must be less than state_size ${this.state_size}`);
    return utils.indexOfMax(this._qTable[state]);
  }

  act(state) {
    var action = null; //null or undefined? Does it matter?
    if (Math.random() <= this.epsilon) {
      action = random.randrange(this.action_size);
    } else {
      action = this.best_action(state);
      if (action >= this.action_size || action == 0) {
        throw new Error(`Invalid choice of action: ${action}. Must be between 0 and ${this.action_size - 1} (inclusive)`);
      }
      return action;
    }
  }

  update(state, action, reward, next_state) {
    // compute the difference
    const best_next_action = this.best_action(next_state);
    const best_next_value = this.q(next_state, best_next_action);
    const diff = reward + (this.discount_factor * best_next_value) - this.q(state, action);
    // compute the update
    const new_value = this.q(state, action) + this.update_rate * diff;

    // do the update
    this._setQ(state, action, new_value);
  }
}

class Agent {
  constructor(qLearner, game) {
    this.ql = qLearner;
    this.game = game;
  }

  play_episode() {
    this.game.reset();
    var state = this.game.state();
    var is_over = False;
    var ep_reward = 0;

    while (!is_over) {
      const action = this.ql.act(state);
      this.game.act(action);
      const next_state = this.game.state();
      var rewrd_isover_array = this.game.feedback();
      reward = reward_isover_array[0];
      is_over = reward_isover_array[1];
      this.ql.update(state, action, reward, next_state);
      state = next_state;
      ep_reward += reward;
    }
    return ep_reward;
  }

  play_n_episodes(n) {
    var n_ep_reward = 0;
    for (var episode = 0; episode < n; ++episode) {
      n_ep_reward += this.play_episode();
    }
    return n_ep_reward;
  }
}

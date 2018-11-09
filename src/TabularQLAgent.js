class TabularQLearner {
  constructor(opts) {
    const defaults = {
      discountRate: 0.95,
      epsilon: 1,
      actionSize: undefined,
      stateSize: undefined,
      updateRate: 0.1,
    };
    opts = {...defaults, ...opts}; // apply the defaults

    console.log('creating tabular qlearning agent', opts);

    // QUESTION should I have it this way or rotated?
    // Create qTable and fill with random numbers
    this._qTable = [];
    for (var state = 0; state < opts.stateSize; ++state) {
      var action_array = [];
      for (var action = 0; action < opts.actionSize; ++action) {
        action_array.push(Math.random());
      }
      this._qTable.push(action_array);
    }
    this.state_size = opts.stateSize;
    this.action_size = opts.actionSize;
    this.discount_factor = opts.discountRate; // gamma
    this.update_rate = opts.updateRate; // alpha
    this.epsilon = opts.epsilon;
  }

  // getQ
  q(state, action) {
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

module.exports = TabularQLearner;

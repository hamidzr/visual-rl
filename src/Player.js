// ochestrator
class Player {
  constructor(qLearner, game) {
    this.ql = qLearner;
    this.game = game;
  }

  play_episode() {
    this.game.reset();
    let state = this.game.state();
    let is_over = false;
    let ep_rewards = [];

    while (!is_over) {
      const action = this.ql.act(state);
      this.game.act(action);
      const next_state = this.game.state();
      let reward_isover_array = this.game.feedback();
      let reward = reward_isover_array[0];
      is_over = reward_isover_array[1];
      this.ql.update(state, action, reward, next_state);
      state = next_state;
      ep_rewards.push(reward);
    }
    return ep_rewards;
  }

  play_n_episodes(n) {
    let n_ep_rewards = [];
    for (var episode = 0; episode < n; ++episode) {
      let epsRewards = this.play_episode();
      n_ep_rewards.push(epsRewards);
      let totalReward = epsRewards.reduce((a, c) => a+c);
      console.log(`episode ${episode} done with epsilon${this.ql.epsilon} rewards: ${totalReward}`);
    }
    return n_ep_rewards;
  }
}


module.exports = Player;

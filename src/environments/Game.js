// game super class

class Game {
  constructor(opts) {
    console.log('creating game driver');
    // TODO test the interface
  }

  get state() {
    throw new Error('Method is not implemented.');
  }

  async step(action) {
    throw new Error('Method is not implemented.');
  }

  reset() {
    throw new Error('Method is not implemented.');
  }

  async act(action) {
    throw new Error('Method is not implemented.');
  }

  // run once after an action to get its feedback
  get feedback() {
    throw new Error('Method is not implemented.');
  }

  // basic tests for the implemented game
  _test() {
    console.assert(this.state() instanceof tf.Tensor || Array.isArray(this.state()), 'state is not formatted properly');
  }
}

module.exports = Game;

const app = require('./app')

class BotAPI {
  constructor(client) {
    this.client = client
  }

  run() {
    app(this.client)
  }
}

module.exports = BotAPI

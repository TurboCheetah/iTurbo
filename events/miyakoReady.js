const Event = require('#structures/Event')

class MiyakoReady extends Event {
  async run() {
    // Roll a random presence every 5 minutes.
    this.client.setInterval(() => this.client.rollPresence(), 300000)
    // Sweep cache every 10 minutes.
    this.client.sweeper.task = this.client.setInterval(() => this.client.sweeper.run(), 600000)
  }
}

module.exports = MiyakoReady

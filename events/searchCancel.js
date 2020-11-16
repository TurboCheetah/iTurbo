const Event = require('../structures/Event.js')
class searchCancel extends Event {
  async run (msg) {
    msg.channel.send('Searching canceled')
  }
}

module.exports = searchCancel

const Command = require('../../structures/Command.js')

class Waifu extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Sends a randomly generated Waifu from thiswaifudoesnotexist.net'
    })
  }

  async run (ctx) {
    return ctx.reply(`https://www.thiswaifudoesnotexist.net/example-${Math.floor(Math.random() * 100000)}.jpg`)
  }
}

module.exports = Waifu

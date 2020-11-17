const Command = require('../../structures/Command.js')

class Skip extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Skips the current song',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'skip',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx) {
    this.client.distube.skip(ctx.message)
  }
}

module.exports = Skip

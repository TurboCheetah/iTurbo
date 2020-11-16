const Command = require('../../structures/Command.js')

class Shuffle extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Shuffles the current queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'shuffle',
      guildOnly: true,
      cost: 0,
      cooldown: 20
    })
  }

  async run (ctx) {
    this.client.distube.shuffle(ctx.message)
  }
}

module.exports = Shuffle

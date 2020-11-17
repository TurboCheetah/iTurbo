const Command = require('../../structures/Command.js')

class Stop extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Stops the queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'stop',
      guildOnly: true,
      cost: 0,
      cooldown: 10
    })
  }

  async run (ctx) {
    this.client.distube.stop(ctx.message)
    ctx.reply('🛑 Stopped')
  }
}

module.exports = Stop

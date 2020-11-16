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
      cooldown: 20
    })
  }

  async run (ctx) {
    distube.stop(ctx.message)
    ctx.reply('🛑 Stopped')
  }
}

module.exports = Stop

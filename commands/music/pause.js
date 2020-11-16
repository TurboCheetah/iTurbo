const Command = require('../../structures/Command.js')

class Pause extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Pauses the currently playing song',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'pause',
      guildOnly: true,
      cost: 0,
      cooldown: 20
    })
  }

  async run (ctx, args) {
    if (!args.length) return ctx.reply('What do you want me to play? Please provide a search query or song url!')

    this.client.distube.pause(ctx.message)
    ctx.reply('⏸ Paused')
  }
}

module.exports = Pause

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

  async run (ctx) {
    if (this.client.distube.isPaused(ctx.message)) {
      this.client.distube.resume(ctx.message)
      return ctx.reply('▶ Resumed')
    }

    this.client.distube.pause(ctx.message)
    ctx.reply('⏸ Paused')
  }
}

module.exports = Pause

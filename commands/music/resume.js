const Command = require('../../structures/Command.js')

class Resume extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Resumes the queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'resume',
      guildOnly: true,
      cost: 0,
      cooldown: 20
    })
  }

  async run (ctx) {
    if (!this.client.distube.isPaused(ctx.message)) {
      return ctx.reply('The queue has not been paused!')
    }

    this.client.distube.resume(ctx.message)
    ctx.reply('▶ Resumed')
  }
}

module.exports = Resume

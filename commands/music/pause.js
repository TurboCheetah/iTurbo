const Command = require('../../structures/Command.js')

class Pause extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Plays the desired song',
      aliases: ['pl'],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'play <search query or URL>',
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

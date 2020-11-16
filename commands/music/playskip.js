const Command = require('../../structures/Command.js')

class PlaySkip extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Skips the current song and plays the desired song',
      aliases: ['pskip'],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'playskip <search query or URL>',
      guildOnly: true,
      cost: 0,
      cooldown: 20
    })
  }

  async run (ctx, args) {
    if (!args.length) return ctx.reply('What do you want me to play? Please provide a search query or song url!')

    this.client.distube.playSkip(ctx.message, args.join(' '))
  }
}

module.exports = PlaySkip

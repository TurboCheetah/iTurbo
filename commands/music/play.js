const Command = require('../../structures/Command.js')

class Play extends Command {
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

    this.client.distube.play(ctx.message, args.join(' '))
  }
}

module.exports = Play
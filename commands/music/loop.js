const Command = require('../../structures/Command.js')

class Loop extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Turns looping on',
      aliases: ['repeat'],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'loop <disable | song | queue>',
      guildOnly: true,
      cost: 0,
      cooldown: 20
    })
  }

  async run (ctx, args) {
    // if (!args.length) return ctx.reply('What do you want me to play? Please provide a search query or song url!')
    switch (args) {
      case 'disable' || 'off':
        this.client.distube.setRepeatMode(ctx.message, 0)
        break
      case 'song':
        this.client.distube.setRepeatMode(ctx.message, 1)
        break
      case 'queue':
        this.client.distube.setRepeatMode(ctx.message, 2)
        break
      default:
        ctx.reply('Invalid option!')
        break
    }
  }
}

module.exports = Loop

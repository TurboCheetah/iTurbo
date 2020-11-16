const Command = require('../../structures/Command.js')

class Loop extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Turns looping on',
      aliases: ['repeat'],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'loop <0 (off) or 1 (on)>',
      guildOnly: true,
      cost: 0,
      cooldown: 20
    })
  }

  async run (ctx, args) {
    if (!args.length) return ctx.reply('What do you want me to play? Please provide a search query or song url!')

    this.client.distube.setRepeatMode(ctx.message, parseInt(args[0]))
    ctx.reply('⏸ Paused')
  }
}

module.exports = Loop

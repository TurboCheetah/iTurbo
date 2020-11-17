const Command = require('../../structures/Command.js')

class Volume extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Adjusts the volume',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'volume <percent>',
      guildOnly: true,
      cost: 0,
      cooldown: 5
    })
  }

  async run (ctx, args) {
    if (!args[0]) {
      const queue = this.client.distube.getQueue(ctx.message)
      return ctx.reply(`The volume is currently at ${queue.volume}%.`)
    }

    if (!Number(args[0])) {
      return ctx.reply('Invalid number! Please choose a percent from 0-100%')
    }

    this.client.distube.setVolume(ctx.message, Number(args[0]))

    ctx.reply(`Set volume to ${args[0]}%!`)
  }
}

module.exports = Volume

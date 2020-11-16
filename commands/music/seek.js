const Command = require('../../structures/Command.js')

class Seek extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Seeks to a desired time in the song',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'seek <time>',
      guildOnly: true,
      cost: 0,
      cooldown: 10
    })
  }

  async run (ctx, args) {
    if (isNaN(args[0])) {
      return ctx.reply('Please supply a valid number!')
    }

    this.client.distube.seek(ctx.message, Number(args[0]))
    ctx.reply(`Moved ${args[0]} seconds ahead!`)
  }
}

module.exports = Seek

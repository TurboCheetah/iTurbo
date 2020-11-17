const Command = require('../../structures/Command.js')

class Jump extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Jump to the song number in the queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'jump <song number>',
      guildOnly: true,
      cost: 0,
      cooldown: 5
    })
  }

  async run (ctx, args) {
    if (!args.length) return ctx.reply('What song do you want me to skip to? Please provide a valid song number!')

    this.client.distube.jump(ctx.message, parseInt(args[0] - 1))
  }
}

module.exports = Jump

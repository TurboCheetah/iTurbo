const Command = require('../../structures/Command.js')

class Autoplay extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Toggle autoplay mode',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'autoplay',
      guildOnly: true,
      cost: 0,
      cooldown: 5
    })
  }

  async run (ctx) {
    const mode = this.client.distube.toggleAutoplay(ctx.message)

    ctx.reply(`Turned autoplay ${mode ? 'on' : 'off'}.`)
  }
}

module.exports = Autoplay

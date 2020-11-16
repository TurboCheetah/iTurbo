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
      cooldown: 20
    })
  }

  async run (ctx) {
    let mode = this.client.distube.toggleAutoplay(ctx.message);
    
    ctx.reply(`Turned autoplay ${mode ? 'on': 'off'}.`)
  }
}

module.exports = Autoplay

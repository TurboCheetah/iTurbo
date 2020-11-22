const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Stop extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Stops the queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'stop',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx) {
    const queue = this.client.distube.getQueue(ctx.message)
    this.client.distube.stop(ctx.message)
/*     if (queue || queue !== undefined) {
      this.client.distube.stop(ctx.message)
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| 🛑 Stopped', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    } */

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('| 🛑 Stopped', ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Stop

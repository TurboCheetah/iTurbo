const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Autoplay extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Toggle autoplay mode',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'autoplay',
      guildOnly: true,
      cost: 0,
      cooldown: 5
    })
  }

  async run (ctx) {
    if (!queue) {
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    const mode = this.client.distube.toggleAutoplay(ctx.message)
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| Turned autoplay ${mode ? 'on' : 'off'}`, ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Autoplay

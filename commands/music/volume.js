const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Volume extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Adjusts the volume',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'volume <percent>',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx, args) {
    const queue = this.client.distube.getQueue(ctx.message)

    if (!queue) {
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!args[0]) {
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor(`| The current playback volume is at ${queue.volume}%`, ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!Number(args[0])) {
      return ctx.reply('Invalid number! Please choose a percent from 0-100%')
    }

    this.client.distube.setVolume(ctx.message, Number(args[0]))
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| Set volume to ${args[0]}%`, ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Volume

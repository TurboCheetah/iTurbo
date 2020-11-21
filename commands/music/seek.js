const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Seek extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Seeks to a desired time in the song',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'seek <time in seconds>',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx, args) {
    if (isNaN(args[0])) {
      return ctx.reply('Please supply a valid number!')
    }

    this.client.distube.seek(ctx.message, Number(args[0]) * 1000)
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| Moved ${args[0]} seconds ahead!`, ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Seek

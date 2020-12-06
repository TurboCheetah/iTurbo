const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Skip extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Skips the current song',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'skip',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx) {
    const queue = this.client.distube.getQueue(ctx.message)

    if (!queue) {
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    this.client.distube.skip(ctx.message)

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('⏭ Skipped')
      .setTitle(queue.songs[0].name)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
    ctx.reply({ embed })
  }
}

module.exports = Skip

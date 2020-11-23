const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Shuffle extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Shuffles the current queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'shuffle',
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
        .setAuthor('| There is nothing in the queue!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    this.client.distube.shuffle(ctx.message)
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('| Shuffled queue!', ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Shuffle

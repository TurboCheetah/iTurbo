const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Jump extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Jump to the song number in the queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'jump <song number>',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx, args) {
    if (!args.length) return ctx.reply('What song do you want me to skip to? Please provide a valid song number!')

    this.client.distube.jump(ctx.message, parseInt(args[0] - 1))
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| Jumped to song ${args[0]}`, ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Jump

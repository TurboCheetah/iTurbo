const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Seek extends Command {
  constructor(...args) {
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

  async run(ctx, args) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) || !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.reply(`${this.client.constants.error} You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`)
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (isNaN(args[0])) {
      return ctx.reply('Please supply a valid number!')
    }

    player.seek(Number(args[0]) * 1000)
    const embed = new MessageEmbed().setColor(0x9590ee).setAuthor(`| Moved ${args[0]} seconds ahead!`, ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Seek

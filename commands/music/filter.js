const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Filter extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enable or disable a filter. Run the command again to disable a filter.',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'filter <filter>',
      guildOnly: true,
      cost: 0,
      cooldown: 5
    })
  }

  async run(ctx, [filter = 'list']) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.reply(`${this.client.constants.error} You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`)
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    const embed = new MessageEmbed().setColor(0x9590ee).setAuthor(`| ${!player[filter] ? 'Enabled' : 'Disabled'} the ${filter.toLowerCase()} filter`, ctx.author.displayAvatarURL({ size: 512 }))

    switch (filter.toLowerCase()) {
      case 'list':
        ctx.reply('Available filters:\n```\nbassboost\nnightcore\nvaporwave\ndistortion```')
        break
      case 'bassboost':
        player.setBassboost(!player.bassboost)
        ctx.reply({ embed })
        break
      case 'nightcore':
        player.setNightcore(!player.nightcore)
        ctx.reply({ embed })
        break
      case 'vaporwave':
        player.setVaporwave(!player.vaporwave)
        ctx.reply({ embed })
        break
      case 'distortion':
        player.setDistortion(!player.distorion)
        ctx.reply({ embed })
        break
      default:
        ctx.reply(`Invalid filter! Use \`${ctx.guild ? ctx.guild.settings.prefix : '|'}filter list\` to get a list of available filters.`)
        break
    }
  }
}

module.exports = Filter

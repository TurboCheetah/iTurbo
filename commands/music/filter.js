const Command = require('../../structures/Command.js')

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
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.msgEmbed(`You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`, this.client.constants.emojis.errorImg)
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      return ctx.msgEmbed('Nothing is playing!', this.client.constants.emojis.errorImg)
    }

    switch (filter.toLowerCase()) {
      case 'list':
        ctx.msgEmbed('Available filters:\n```\nbassboost\nnightcore\nvaporwave\ndistortion```')
        break
      case 'bassboost':
        player.setBassboost(!player.bassboost)
        ctx.msgEmbed(`${!player[filter] ? 'Enabled' : 'Disabled'} the ${filter.toLowerCase()} filter`, this.client.constants.emojis.successImg)
        break
      case 'nightcore':
        player.setNightcore(!player.nightcore)
        ctx.msgEmbed(`${!player[filter] ? 'Enabled' : 'Disabled'} the ${filter.toLowerCase()} filter`, this.client.constants.emojis.successImg)
        break
      case 'vaporwave':
        player.setVaporwave(!player.vaporwave)
        ctx.msgEmbed(`${!player[filter] ? 'Enabled' : 'Disabled'} the ${filter.toLowerCase()} filter`, this.client.constants.emojis.successImg)
        break
      case 'distortion':
        player.setDistortion(!player.distorion)
        ctx.msgEmbed(`${!player[filter] ? 'Enabled' : 'Disabled'} the ${filter.toLowerCase()} filter`, this.client.constants.emojis.successImg)
        break
      default:
        ctx.reply(`Invalid filter! Use \`${ctx.guild ? ctx.guild.settings.prefix : '|'}filter list\` to get a list of available filters.`)
        break
    }
  }
}

module.exports = Filter

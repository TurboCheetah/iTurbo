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
    this.client.utils.isDJ(ctx)

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      return ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
    }

    switch (filter.toLowerCase()) {
      case 'list':
        ctx.msgEmbed('Available filters:\n```\nbassboost\nnightcore\nvaporwave\ndistortion```')
        break
      case 'bassboost':
        player.setBassboost(!player.bassboost)
        ctx.msgEmbed(`${!player[filter] ? 'Enabled' : 'Disabled'} the ${filter.toLowerCase()} filter`, this.client.constants.successImg)
        break
      case 'nightcore':
        player.setNightcore(!player.nightcore)
        ctx.msgEmbed(`${!player[filter] ? 'Enabled' : 'Disabled'} the ${filter.toLowerCase()} filter`, this.client.constants.successImg)
        break
      case 'vaporwave':
        player.setVaporwave(!player.vaporwave)
        ctx.msgEmbed(`${!player[filter] ? 'Enabled' : 'Disabled'} the ${filter.toLowerCase()} filter`, this.client.constants.successImg)
        break
      case 'distortion':
        player.setDistortion(!player.distorion)
        ctx.msgEmbed(`${!player[filter] ? 'Enabled' : 'Disabled'} the ${filter.toLowerCase()} filter`, this.client.constants.successImg)
        break
      default:
        ctx.reply(`Invalid filter! Use \`${ctx.guild ? ctx.guild.settings.prefix : '|'}filter list\` to get a list of available filters.`)
        break
    }
  }
}

module.exports = Filter

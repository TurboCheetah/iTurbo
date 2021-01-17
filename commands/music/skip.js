const Command = require('../../structures/Command.js')

class Skip extends Command {
  constructor(...args) {
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

  async run(ctx) {
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.msgEmbed(`You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`, this.client.constants.emojis.errorImg)
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      return ctx.msgEmbed('Nothing is playing!', this.client.constants.emojis.errorImg)
    }

    if (!ctx.channel.guild.settings.nowplaying) await ctx.success()
    player.stop()
  }
}

module.exports = Skip

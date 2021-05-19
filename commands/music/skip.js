const Command = require('#structures/Command')

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
    this.client.utils.isDJ(ctx)

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      return ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
    }

    if (!ctx.channel.guild.settings.nowplaying) await ctx.success()
    player.stop()
  }
}

module.exports = Skip

const Command = require('#structures/Command')

class Stop extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Stops the queue',
      aliases: ['leave'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'stop',
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

    player.destroy()
    return ctx.msgEmbed('🛑 Stopped')
  }
}

module.exports = Stop

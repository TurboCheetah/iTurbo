const Command = require('#structures/Command')

class Pause extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Pauses the currently playing song',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'pause',
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

    if (player.paused) {
      player.pause(false)
      return ctx.msgEmbed('▶ Resumed the player')
    }

    player.pause(true)
    return ctx.msgEmbed('⏸ Paused the player')
  }
}

module.exports = Pause

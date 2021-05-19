const Command = require('#structures/Command')

class Resume extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Resumes the queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'resume',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx) {
    this.client.utils.isDJ(ctx)

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
    }

    if (!player.paused) {
      return ctx.msgEmbed('The queue has not been paused!', this.client.constants.errorImg)
    }

    player.pause(false)
    return ctx.msgEmbed('▶ Resumed the player')
  }
}

module.exports = Resume

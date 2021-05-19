const Command = require('#structures/Command')

class ClearQueue extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Clears the queue',
      aliases: ['clearq'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'clearqueue',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx) {
    this.client.utils.isDJ(ctx)

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player || !player.queue.length) {
      return ctx.msgEmbed('Nothing is playing!', this.client.constants.errorImg)
    }

    ctx.msgEmbed('Successfully cleared the queue')
    player.queue.clear()
  }
}

module.exports = ClearQueue

const Command = require('#structures/Command')

class Shuffle extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Shuffles the current queue',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'shuffle',
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

    player.queue.shuffle()
    ctx.msgEmbed('Shuffled queue!', this.client.constants.successImg)
  }
}

module.exports = Shuffle

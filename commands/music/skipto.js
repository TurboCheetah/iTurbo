const Command = require('#structures/Command')

class SkipTo extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Skips to the desired location in the queue',
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'skipto <position>',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, [position]) {
    this.client.utils.isDJ(ctx)

    const channel = ctx.member.voice.channel
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player || !player.queue.length > 0) {
      return ctx.msgEmbed('There is nothing in the queue!', this.client.constants.errorImg)
    }

    if (!channel || (channel && channel.id !== player.voiceChannel)) return ctx.msgEmbed('You need to be in the voice channel with me to skip to that song!', this.client.constants.errorImg)

    if (!position) return ctx.msgEmbed(`Correct usage: \`${ctx.guild.settings.prefix}skipto <position>\``, this.client.constants.errorImg)

    position = this.verifyInt(position, 1) - 1

    ctx.msgEmbed(`Skipped to position **${[position + 1]}**!`, this.client.constants.successImg)

    player.queue.remove(0, position)
    player.stop()
  }
}

module.exports = SkipTo

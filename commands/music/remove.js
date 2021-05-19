/* eslint-disable no-case-declarations */
const Command = require('#structures/Command')

class Remove extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Removes the desired song from the queue',
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'remove <songPosition>',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, [songPosition, endPosition]) {
    this.client.utils.isDJ(ctx)

    const channel = ctx.member.voice.channel
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player || !player.queue.length > 0) {
      return ctx.msgEmbed('There is nothing to move!', this.client.constants.errorImg)
    }

    if (!channel || (channel && channel.id !== player.voiceChannel)) return ctx.msgEmbed('You need to be in the voice channel with me to move music!', this.client.constants.errorImg)

    if (!songPosition) return ctx.msgEmbed(`Correct usage: \`${ctx.guild.settings.prefix}remove <songPosition> [endPosition]\`\nExample: \`${ctx.guild.settings.prefix}remove 3 5\``, this.client.constants.errorImg)

    songPosition = this.verifyInt(songPosition, 1) - 1

    if (endPosition) {
      endPosition = this.verifyInt(endPosition, 1)
      ctx.msgEmbed(`Removed songs **${songPosition + 1}-${endPosition}** from the queue!`, this.client.constants.successImg)
      return player.queue.remove(songPosition, endPosition)
    }

    ctx.msgEmbed(`Removed **${player.queue[songPosition].title}** from the queue!`, this.client.constants.successImg)

    player.queue.remove(songPosition)
  }
}

module.exports = Remove

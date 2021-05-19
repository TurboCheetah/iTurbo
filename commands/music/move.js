const Command = require('#structures/Command')

class Move extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Moves the desired song to a certain position in the queue',
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'move <songPosition> <newPosition>',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, [songPosition, newPosition]) {
    this.client.utils.isDJ(ctx)

    const channel = ctx.member.voice.channel
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player || !player.queue.length > 0) {
      return ctx.msgEmbed('There is nothing to move!', this.client.constants.errorImg)
    }

    if (!channel || (channel && channel.id !== player.voiceChannel)) return ctx.msgEmbed('You need to be in the same voice channel as me to move music!', this.client.constants.errorImg)

    if (!songPosition || !newPosition) return ctx.msgEmbed(`Correct usage: \`${ctx.guild.settings.prefix}move <songPosition> <newPosition>\`\nExample: \`${ctx.guild.settings.prefix}move 3 1\``, this.client.constants.errorImg)
    if (songPosition < newPosition) return ctx.msgEmbed('Please move something up the queue, not down!', this.client.constants.errorImg)
    songPosition = this.verifyInt(songPosition, 1) - 1
    newPosition = this.verifyInt(newPosition, 1) - 1

    ctx.msgEmbed(`Moved **${player.queue[songPosition].title}** to **${newPosition + 1}**`, this.client.constants.successImg)

    player.queue.splice(newPosition, 1, player.queue[songPosition], player.queue[newPosition])
    player.queue.splice(songPosition + 1, 1)
  }
}

module.exports = Move

/* eslint-disable no-case-declarations */
const Command = require('../../structures/Command.js')

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
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.msgEmbed(`You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`, this.client.constants.emojis.errorImg)
    }

    const channel = ctx.member.voice.channel
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player || !player.queue.length > 0) {
      return ctx.msgEmbed('There is nothing to move!', this.client.constants.emojis.errorImg)
    }

    if (!channel || (channel && channel.id !== player.voiceChannel)) return ctx.msgEmbed('You need to be in the voice channel with me to move music!', this.client.constants.emojis.errorImg)

    if (!songPosition) return ctx.msgEmbed(`Correct usage: \`${ctx.guild.settings.prefix}remove <songPosition> [endPosition]\`\nExample: \`${ctx.guild.settings.prefix}remove 3 5\``, this.client.constants.emojis.errorImg)

    songPosition = this.verifyInt(songPosition, 1) - 1

    if (endPosition) {
      endPosition = this.verifyInt(endPosition, 1)
      ctx.msgEmbed(`Removed songs **${songPosition + 1}-${endPosition}** from the queue!`, this.client.constants.emojis.successImg)
      return player.queue.remove(songPosition, endPosition)
    }

    ctx.msgEmbed(`Removed **${player.queue[songPosition].title}** from the queue!`, this.client.constants.emojis.successImg)

    player.queue.remove(songPosition)
  }
}

module.exports = Remove

/* eslint-disable no-case-declarations */
const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

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
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.reply(`${this.client.constants.error} You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`)
    }

    const channel = ctx.member.voice.channel
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player || !player.queue.length > 0) {
      const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| There is nothing to move!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!channel || (channel && channel.id !== player.voiceChannel)) return ctx.reply(`${this.client.constants.error} You need to be in the voice channel with me to move music!`)

    if (!songPosition) return ctx.reply(`${this.client.constants.error} Correct usage: \`${ctx.guild.settings.prefix}move <songPosition> <newPosition>\`\nExample: \`${ctx.guild.settings.prefix}move 3 1\``)

    songPosition = this.verifyInt(songPosition, 1) - 2

    if (endPosition) {
      endPosition = this.verifyInt(endPosition, 1) - 1
      ctx.reply(`${this.client.constants.success} Removed songs **${songPosition + 2}-${endPosition + 1}** from the queue!`)
      return player.queue.remove(songPosition, endPosition)
    }

    ctx.reply(`${this.client.constants.success} Removed **${player.queue[songPosition].title}** from the queue!`)

    player.queue.remove(songPosition)
  }
}

module.exports = Remove

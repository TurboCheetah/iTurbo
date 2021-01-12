/* eslint-disable no-case-declarations */
const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

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

    if (!channel || (channel && channel.id !== player.voiceChannel)) return ctx.reply(`${this.client.constants.error} You need to be in the same voice channel as me to move music!`)

    if (!songPosition || !newPosition) return ctx.reply(`${this.client.constants.error} Correct usage: \`${ctx.guild.settings.prefix}move <songPosition> <newPosition>\`\nExample: \`${ctx.guild.settings.prefix}move 3 1\``)
    if (songPosition < newPosition) return ctx.reply(`${this.client.constants.error} Please move something up the queue, not down!`)
    songPosition = this.verifyInt(songPosition, 1) - 1
    newPosition = this.verifyInt(newPosition, 1) - 1

    ctx.reply(`${this.client.constants.success} Moved **${player.queue[songPosition].title}** to **${newPosition + 1}**`)

    player.queue.splice(newPosition, 1, player.queue[songPosition], player.queue[newPosition])
    player.queue.splice(songPosition + 1, 1)
  }
}

module.exports = Move
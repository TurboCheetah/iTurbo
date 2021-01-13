/* eslint-disable no-case-declarations */
const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

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
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.reply(`${this.client.constants.error} You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`)
    }

    const channel = ctx.member.voice.channel
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player || !player.queue.length > 0) {
      const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| There is nothing in the queue!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!channel || (channel && channel.id !== player.voiceChannel)) return ctx.reply(`${this.client.constants.error} You need to be in the voice channel with me to skip to that song!`)

    if (!position) return ctx.reply(`${this.client.constants.error} Correct usage: \`${ctx.guild.settings.prefix}skipto <position>\``)

    position = this.verifyInt(position, 1) - 1

    ctx.reply(`${this.client.constants.success} Skipped to position **${[position + 1]}**!`)

    player.queue.remove(0, position)
    player.stop()
  }
}

module.exports = SkipTo

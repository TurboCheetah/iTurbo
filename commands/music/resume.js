const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

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
    const djRole = ctx.guild.settings.djRole

    if (djRole) {
      if (!ctx.member.roles.cache.has(djRole) && !ctx.member.permissions.has('MANAGE_GUILD')) return ctx.reply(`${this.client.constants.error} You are not a DJ! You need the ${ctx.guild.roles.cache.find(r => r.id === djRole)} role!`)
    }

    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!player.paused) {
      return ctx.reply('The queue has not been paused!')
    }

    player.pause(false)
    const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| ▶ Resumed the player', ctx.author.displayAvatarURL({ size: 512 }))
    return ctx.reply({ embed })
  }
}

module.exports = Resume

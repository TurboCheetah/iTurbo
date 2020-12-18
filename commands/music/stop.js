const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Stop extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Stops the queue',
      aliases: ['leave'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'stop',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx) {
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player) {
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    player.destroy()
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('| 🛑 Stopped', ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Stop

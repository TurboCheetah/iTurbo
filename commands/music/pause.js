const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Pause extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Pauses the currently playing song',
      aliases: [],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'pause',
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

    if (player.paused) {
      player.pause(false)
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| ▶ Resumed the player', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    player.pause(true)
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('| ⏸ Paused the player', ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Pause

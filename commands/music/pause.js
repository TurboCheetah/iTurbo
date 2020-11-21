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
      cooldown: 5
    })
  }

  async run (ctx) {
    if (this.client.distube.isPaused(ctx.message)) {
      this.client.distube.resume(ctx.message)
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| ▶ Resumed the player', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    this.client.distube.pause(ctx.message)
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('| ⏸ Paused the player', ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Pause

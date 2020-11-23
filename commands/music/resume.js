const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Resume extends Command {
  constructor (...args) {
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

  async run (ctx) {
    const queue = this.client.distube.getQueue(ctx.message)

    if (!queue) {
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!this.client.distube.isPaused(ctx.message)) {
      return ctx.reply('The queue has not been paused!')
    }

    this.client.distube.resume(ctx.message)
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('| ▶ Resumed the player', ctx.author.displayAvatarURL({ size: 512 }))
    ctx.reply({ embed })
  }
}

module.exports = Resume

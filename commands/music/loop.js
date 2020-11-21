const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Loop extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Turns looping on',
      aliases: ['repeat'],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'loop <disable | song | queue>',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64 }))
        .setDescription('Would you like to loop the current **song**, **queue**, or **disable** looping?\n\nReply with `cancel` to cancel the oeration. The message will timeout after 60 seconds.')
        .setTimestamp()
        .setColor(0x9590EE)

      const filter = (msg) => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

      if (['on', 'enable', 'song'].includes(response.toLowerCase())) {
        this.client.distube.setRepeatMode(ctx.message, 1)
        return ctx.reply('Enabled looping for the current song.')
      } else if (['queue'].includes(response.toLowerCase())) {
        this.client.distube.setRepeatMode(ctx.message, 2)
        return ctx.reply('Enabled looping for the queue.')
      } else if (['off', 'disable'].includes(response)) {
        this.client.distube.setRepeatMode(ctx.message, 0)
        return ctx.reply('Disabled looping.')
      } else if (['cancel'].includes(response)) {
        return ctx.reply('Operation cancelled.')
      } else {
        return ctx.reply('Invalid response, please try again.')
      }
    }
    switch (args[0]) {
      case 'disable' || 'off':
        this.client.distube.setRepeatMode(ctx.message, 0)
        ctx.reply('Disabled looping.')
        break
      case 'song':
        this.client.distube.setRepeatMode(ctx.message, 1)
        ctx.reply('Enabled looping for the current song.')
        break
      case 'queue':
        this.client.distube.setRepeatMode(ctx.message, 2)
        ctx.reply('Enabled looping for the queue.')
        break
      default:
        ctx.reply('Invalid option!')
        break
    }
  }
}

module.exports = Loop

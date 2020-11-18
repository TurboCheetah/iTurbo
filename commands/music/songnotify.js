const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class songNotify extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Enables or disables now playing notifications',
      usage: 'songnotify',
      guildOnly: true,
      aliases: ['npnotify', 'musicnotify']
    })
  }

  async run (ctx) {
    if (!ctx.member.permissions.has('MANAGE_GUILD')) return ctx.reply('You need the `Manage Server` permissions to change this setting.')

    const embed = new MessageEmbed()
      .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64 }))
      .setDescription('Would you like to turn now playing notifications **on** or **off**?\n\nReply with `cancel` to cancel the message. The message will timeout after 60 seconds.')
      .setTimestamp()
      .setColor(0x9590EE)

    const filter = (msg) => msg.author.id === ctx.author.id
    const response = await ctx.message.awaitReply('', filter, 60000, embed)
    if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

    if (['on', 'enable'].includes(response.toLowerCase())) {
      await ctx.guild.update({ nowplaying: true })
      return ctx.reply('Successfully turned now playing notifications on.')
    } else if (['off', 'disable'].includes(response)) {
      await ctx.guild.update({ nowplaying: false })
      return ctx.reply('Successfully turned now playing notifications off.')
    } else if (['cancel'].includes(response)) {
      return ctx.reply('Operation cancelled.')
    } else {
      return ctx.reply('Invalid response, please try again.')
    }
  }
}

module.exports = songNotify

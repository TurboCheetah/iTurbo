const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Social extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enable/Disable The social economy system.',
      aliases: ['economy'],
      userPermissions: ['MANAGE_GUILD'],
      usage: 'social <enable/disable>',
      guildOnly: true
    })
  }

  async run(ctx, [action]) {
    if (!action || !['enable', 'disable'].includes(action)) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription('Do you want me to disable or enable it?')
        .setTimestamp()
        .setColor(0x9590ee)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

      if (['enable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ social: true })
        return ctx.reply(`${this.client.constants.emojis.success} Successfully enabled the social economy system.`)
      } else if (['disable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ social: false })
        return ctx.reply(`${this.client.constants.emojis.success} Successfully disabled the social economy system.`)
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply('Operation cancelled.')
      }
    }

    if (action === 'enable') {
      await ctx.guild.update({ social: true })
      return ctx.reply(`${this.client.constants.emojis.success} Successfully enabled the social economy system.`)
    }

    if (action === 'disable') {
      await ctx.guild.update({ social: false })
      return ctx.reply(`${this.client.constants.emojis.success} Successfully disabled the social economy system.`)
    }
  }
}

module.exports = Social

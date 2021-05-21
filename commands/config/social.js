const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Social extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('socialDescription'),
      usage: language => language.get('socialUsage'),
      aliases: ['economy'],
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action]) {
    if (!action || !['enable', 'disable'].includes(action)) {
      const embed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))
        .setDescription(ctx.language.get('socialPrompt'))
        .setTimestamp()

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply(ctx.language.get('noReplyTimeout', 60))

      if (['enable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ social: true })
        return ctx.successMsg(ctx.language.get('success'), ctx.language.get('socialEnabled'))
      } else if (['disable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ social: false })
        return ctx.successMsg(ctx.language.get('success'), ctx.language.get('socialDisabled'))
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply(ctx.language.get('operationCancelled'))
      }
    }

    if (action === 'enable') {
      await ctx.guild.update({ social: true })
      return ctx.successMsg(ctx.language.get('success'), ctx.language.get('socialEnabled'))
    }

    if (action === 'disable') {
      await ctx.guild.update({ social: false })
      return ctx.successMsg(ctx.language.get('success'), ctx.language.get('socialDisabled'))
    }
  }
}

module.exports = Social

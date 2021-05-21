const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class LevelUp extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('levelupDescription'),
      usage: language => language.get('levelupUsage'),
      aliases: ['levelupmessages', 'levelmessage', 'lvlmsg', 'lvlupmessages'],
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action]) {
    if (!action || !['enable', 'disable'].includes(action)) {
      const embed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))
        .setDescription(ctx.language.get('levelupPrompt'))
        .setTimestamp()

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply(ctx.language.get('noReplyTimeout', 60))

      if (['enable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ levelup: true })
        return ctx.successMsg(ctx.language.get('levelupEnabled'))
      } else if (['disable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ levelup: false })
        return ctx.successMsg(ctx.language.get('levelupDisabled'))
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.reply(ctx.language.get('operationCancelled'))
      }
    }

    if (action === 'enable') {
      await ctx.guild.update({ levelup: true })
      return ctx.successMsg(ctx.language.get('levelupEnabled'))
    }

    if (action === 'disable') {
      await ctx.guild.update({ levelup: false })
      return ctx.successMsg(ctx.language.get('levelupDisabled'))
    }
  }
}

module.exports = LevelUp

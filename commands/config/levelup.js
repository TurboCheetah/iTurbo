const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class LevelUp extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/config/levelup:description'),
      usage: language => language('commands/config/levelup:usage'),
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
        .setDescription(ctx.translate('commands/config/levelup:prompt'))
        .setTimestamp()

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.tr('common:noReplyTimeout', { time: 60 })

      if (['enable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ levelup: true })
        return ctx.successMsg(ctx.translate('commands/config/levelup:enabled'))
      } else if (['disable'].includes(response.toLowerCase())) {
        await ctx.guild.update({ levelup: false })
        return ctx.successMsg(ctx.translate('commands/config/levelup:disabled'))
      } else if (response.toLowerCase() === 'cancel') {
        return ctx.tr('common:operationCancelled')
      }
    }

    if (action === 'enable') {
      await ctx.guild.update({ levelup: true })
      return ctx.successMsg(ctx.translate('commands/config/levelup:enabled'))
    }

    if (action === 'disable') {
      await ctx.guild.update({ levelup: false })
      return ctx.successMsg(ctx.translate('commands/config/levelup:disabled'))
    }
  }
}

module.exports = LevelUp

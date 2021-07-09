const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class HackBan extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/hackban:description'),
      extendedHelp: language => language('commands/moderation/hackban:extendedHelp'),
      userPermissions: ['BAN_MEMBERS'],
      aliases: ['hban'],
      botPermissions: ['BAN_MEMBERS', 'EMBED_LINKS'],
      usage: language => language('commands/moderation/hackban:usage'),
      guildOnly: true
    })
  }

  async run(ctx, [id, ...reason]) {
    if (!id) return ctx.tr('common:correctUsage', { prefix: ctx.guild.prefix, usage: this.usage })

    if (isNaN(parseInt(id))) return ctx.tr('commands/moderation/hackban:invalidID')

    reason = reason.join(' ') || undefined

    try {
      const user = await ctx.guild.members.ban(id, { reason })
      if (ctx.guild.settings.modlog) {
        const channel = this.client.channels.cache.get(ctx.guild.settings.modlog)
        if (!channel) return
        let caseNum = ctx.guild.settings.modlogCase
        caseNum++
        await ctx.guild.update({ modlogCase: caseNum })
        const embed = new MessageEmbed()
          .setColor(0x9590ee)
          .setAuthor(`${user.tag} (${id})`, user.displayAvatarURL({ size: 32, dynamic: true }))
          .addField(ctx.translate('commands/moderation/hackban:action'), ctx.translate('commands/moderation/hackban:ban'))
          .addField(ctx.translate('commands/moderation/hackban:reason'), reason || ctx.translate('commands/moderation/hackban:noReason'))
          .addField(ctx.translate('commands/moderation/hackban:responsibleModerator'), `${ctx.author.tag}`)
          .setFooter(ctx.translate('commands/moderation/hackban:case', { caseNum }))
          .setTimestamp()

        ctx.tr('commands/moderation/ban:success', { user: user.tag, reason: reason || ctx.translate('commands/moderation/hackban:noReason') })
        return channel.send({ embed })
      } else {
        return ctx.tr('commands/moderation/hackban:success', { user: user.tag, reason: reason || ctx.translate('commands/moderation/hackban:noReason') })
      }
    } catch (err) {
      return ctx.tr('commands/moderation/hackban:failure')
    }
  }
}

module.exports = HackBan

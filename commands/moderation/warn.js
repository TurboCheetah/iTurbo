const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Warn extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/warn:description'),
      userPermissions: ['KICK_MEMBERS'],
      botPermissions: ['EMBED_LINKS'],
      usage: language => language('commands/moderation/warn:usage'),
      guildOnly: true
    })
  }

  async run(ctx, [member, ...reason]) {
    member = await this.verifyUser(ctx, member)
    if (!reason.length) return ctx.tr('commands/moderation/warn:noReason')
    reason = reason.length ? reason.join(' ') : null

    if (member.id === ctx.author.id) return ctx.tr('commands/moderation/warn:warnYourself')
    if (member.id === this.client.user.id) return ctx.tr('commands/moderation/warn:warnMe')
    if (member.bot) return ctx.tr('commands/moderation/warn:warnBot')
    if (member.id === ctx.guild.ownerID) return ctx.tr('commands/moderation/warn:warnOwner')

    try {
      await member.send(ctx.translate('commands/moderation/warn:warned', { moderator: ctx.author.tag, guild: ctx.guild.name, reason }))
      if (ctx.guild.settings.modlog) {
        const channel = this.client.channels.cache.get(ctx.guild.settings.modlog)
        if (!channel) return
        let caseNum = ctx.guild.settings.modlogCase
        caseNum++
        await ctx.guild.update({ modlogCase: caseNum })
        const embed = new MessageEmbed()
          .setColor(0x9590ee)
          .setAuthor(`${member.tag} (${member.id})`, member.displayAvatarURL({ size: 32, dynamic: true }))
          .addField(ctx.translate('commands/moderation/warn:action'), ctx.translate('commands/moderation/warn:warn'))
          .addField(ctx.translate('commands/moderation/warn:reason'), reason || ctx.translate('commands/moderation/warn:noReason'))
          .addField(ctx.translate('commands/moderation/warn:responsibleModerator'), `${ctx.author.tag}`)
          .setFooter(ctx.translate('commands/moderation/warn:case', { caseNum }))
          .setTimestamp()

        ctx.tr('commands/moderation/warn:success', { user: member.tag, reason: reason || ctx.translate('commands/moderation/warn:noReason') })
        return channel.send({ embed })
      } else {
        return ctx.tr('commands/moderation/warn:success', { user: member.tag, reason: reason || ctx.translate('commands/moderation/warn:noReason') })
      }
    } catch (err) {
      console.error(err)
      return ctx.tr('commands/moderation/warn:noDM')
    }
  }
}

module.exports = Warn

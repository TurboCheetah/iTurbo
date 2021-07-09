const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Ban extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/ban:description'),
      userPermissions: ['BAN_MEMBERS'],
      botPermissions: ['BAN_MEMBERS', 'EMBED_LINKS'],
      guildOnly: true,
      usage: language => language('commands/moderation/ban:usage')
    })
  }

  async run(ctx, [member, ...reason]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.tr('commands/moderation/ban:banYourself')
    if (member.id === this.client.user.id) return ctx.tr('commands/moderation/ban:banMe')
    if (member.id === ctx.guild.ownerID) return ctx.tr('commands/moderation/ban:banOwner')

    if (member.roles.highest.position >= ctx.member.roles.highest.position) return ctx.reply('You cannot ban this user.')
    if (!member.bannable) return ctx.tr('commands/moderation/ban:unbannable')

    const options = { days: 7 }
    reason = reason.length ? reason.join(' ') : null
    if (reason) options.reason = reason

    await member.ban(options)

    if (ctx.guild.settings.modlog) {
      const channel = this.client.channels.cache.get(ctx.guild.settings.modlog)
      if (!channel) return
      let caseNum = ctx.guild.settings.modlogCase
      caseNum++
      await ctx.guild.update({ modlogCase: caseNum })
      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ size: 32, dynamic: true }))
        .addField(ctx.translate('commands/moderation/ban:action'), ctx.translate('commands/moderation/ban:ban'))
        .addField(ctx.translate('commands/moderation/ban:reason'), reason || ctx.translate('commands/moderation/ban:noReason'))
        .addField(ctx.translate('commands/moderation/ban:responsibleModerator'), `${ctx.author.tag}`)
        .setFooter(ctx.translate('commands/moderation/ban:case', { caseNum }))
        .setTimestamp()

      ctx.tr('commands/moderation/ban:success', { user: member.user.tag, reason: reason || ctx.translate('commands/moderation/ban:noReason') })
      return channel.send({ embed })
    } else {
      return ctx.tr('commands/moderation/ban:success', { user: member.user.tag, reason: reason || ctx.translate('commands/moderation/ban:noReason') })
    }
  }
}

module.exports = Ban

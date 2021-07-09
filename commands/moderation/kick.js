const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Kick extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/kick:description'),
      userPermissions: ['KICK_MEMBERS'],
      botPermissions: ['KICK_MEMBERS', 'EMBED_LINKS'],
      guildOnly: true,
      usage: language => language('commands/moderation/kick:usage')
    })
  }

  async run(ctx, [member, ...reason]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.tr('commands/moderation/kick:kickYourself')
    if (member.id === this.client.user.id) return ctx.tr('commands/moderation/kick:kickMe')
    if (member.id === ctx.guild.ownerID) return ctx.tr('commands/moderation/kick:kickOwner')

    if (member.roles.highest.position >= ctx.member.roles.highest.position) return ctx.reply('You cannot kick this user.')
    if (!member.kickable) return ctx.tr('commands/moderation/kick:unkickable')

    const options = {}
    reason = reason.length ? reason.join(' ') : null
    if (reason) options.reason = reason

    await member.kick(options)

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

      ctx.tr('commands/moderation/kick:success', { user: member.user.tag, reason: reason || ctx.translate('commands/moderation/kick:noReason') })
      return channel.send({ embed })
    } else {
      return ctx.tr('commands/moderation/kick:success', { user: member.user.tag, reason: reason || ctx.translate('commands/moderation/kick:noReason') })
    }
  }
}

module.exports = Kick

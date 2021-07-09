const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Unmute extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/unmute:description'),
      userPermissions: ['KICK_MEMBERS'],
      botPermissions: ['KICK_MEMBERS', 'EMBED_LINKS', 'MANAGE_ROLES'],
      guildOnly: true,
      usage: language => language('commands/moderation/unmute:usage')
    })
  }

  async run(ctx, [member, ...reason]) {
    member = await this.verifyMember(ctx, member)

    if (member.roles.highest.position >= ctx.member.roles.highest.position) return ctx.reply('You cannot unmute this user.')

    reason = reason.length ? reason.join(' ') : null
    const name = 'Muted'

    const mutedRole = ctx.guild.roles.cache.find(role => role.name.toLowerCase() === name.toLowerCase())

    if (!mutedRole) {
      ctx.guild.roles.create({
        name: 'Muted',
        color: 0xff4349,
        permissions: ['READ_MESSAGES']
      })
    }

    if (member.roles.cache.has(mutedRole)) return ctx.tr('commands/moderation/unmute:notMuted', { user: member.user })

    await member.roles.remove(mutedRole)

    if (ctx.guild.settings.modlog) {
      const channel = this.client.channels.cache.get(ctx.guild.settings.modlog)
      if (!channel) return
      let caseNum = ctx.guild.settings.modlogCase
      caseNum++
      await ctx.guild.update({ modlogCase: caseNum })
      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ size: 32, dynamic: true }))
        .addField(ctx.translate('commands/moderation/unmute:action'), ctx.translate('commands/moderation/unmute:unmute'))
        .addField(ctx.translate('commands/moderation/unmute:reason'), reason || ctx.translate('commands/moderation/unmute:noReason'))
        .addField(ctx.translate('commands/moderation/unmute:responsibleModerator'), `${ctx.author.tag}`)
        .setFooter(ctx.translate('commands/moderation/unmute:case', { caseNum }))
        .setTimestamp()

      ctx.tr('commands/moderation/unmute:success', { user: member.user.tag, reason: reason || ctx.translate('commands/moderation/unmute:noReason') })
      return channel.send({ embed })
    } else {
      return ctx.tr('commands/moderation/unmute:success', { user: member.user.tag, reason: reason || ctx.translate('commands/moderation/unmute:noReason') })
    }
  }
}

module.exports = Unmute

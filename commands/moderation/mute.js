const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Mute extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/moderation/mute:description'),
      userPermissions: ['KICK_MEMBERS'],
      botPermissions: ['KICK_MEMBERS', 'EMBED_LINKS', 'MANAGE_ROLES'],
      guildOnly: true,
      usage: language => language('commands/moderation/mute:usage')
    })
  }

  async run(ctx, [member, ...reason]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.tr('commands/moderation/mute:muteYourself')
    if (member.id === this.client.user.id) return ctx.tr('commands/moderation/mute:muteMe')
    if (member.id === ctx.guild.ownerID) return ctx.tr('commands/moderation/mute:muteOwner')

    if (member.roles.highest.position >= ctx.member.roles.highest.position) return ctx.tr('commands/moderation/mute:unmutable')

    reason = reason.length ? reason.join(' ') : null
    const name = 'Muted'

    const mutedRole = ctx.guild.roles.cache.find(role => role.name.toLowerCase() === name.toLowerCase())

    if (!mutedRole) {
      ctx.guild.roles
        .create({
          data: {
            name: 'Muted',
            color: 0xff4349,
            permissions: 'VIEW_CHANNEL'
          },
          reason: 'Muted role did not previously exist or could not be found.'
        })
        .then(role => {
          ctx.guild.channels.cache.forEach(async channel => {
            await channel.overwritePermissions(role, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false,
              CONNECT: false
            })
          })
          ctx.tr('commands/moderation/mute:noMuteRole')
        })
        .catch(console.error)
      return
    }

    if (member.roles.cache.has(mutedRole)) return ctx.reply(`${member.user} is already muted!`)

    await member.roles.add(mutedRole)

    if (ctx.guild.settings.modlog) {
      const channel = this.client.channels.cache.get(ctx.guild.settings.modlog)
      if (!channel) return
      let caseNum = ctx.guild.settings.modlogCase
      caseNum++
      await ctx.guild.update({ modlogCase: caseNum })
      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ size: 32, dynamic: true }))
        .addField(ctx.translate('commands/moderation/mute:action'), ctx.translate('commands/moderation/mute:mute'))
        .addField(ctx.translate('commands/moderation/mute:reason'), reason || ctx.translate('commands/moderation/mute:noReason'))
        .addField(ctx.translate('commands/moderation/mute:responsibleModerator'), `${ctx.author.tag}`)
        .setFooter(ctx.translate('commands/moderation/mute:case', { caseNum }))
        .setTimestamp()

      ctx.tr('commands/moderation/mute:success', { user: member.user.tag, reason: reason || ctx.translate('commands/moderation/mute:noReason') })
      return channel.send({ embed })
    } else {
      return ctx.tr('commands/moderation/mute:success', { user: member.user.tag, reason: reason || ctx.translate('commands/moderation/mute:noReason') })
    }
  }
}

module.exports = Mute

const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Unmute extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Unmutes a user.',
      userPermissions: ['KICK_MEMBERS'],
      botPermissions: ['KICK_MEMBERS', 'EMBED_LINKS', 'MANAGE_ROLES'],
      guildOnly: true,
      usage: 'unmute <@member> [reason]'
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

    if (member.roles.cache.has(mutedRole)) return ctx.reply(`${member.user} isn't muted!`)

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
        .addField('Action', 'Unmute')
        .addField('Reason', reason || 'No reason specified')
        .addField('Responsible moderator', `${ctx.author.tag}`)
        .setFooter(`Case ${caseNum}`)
        .setTimestamp()

      ctx.reply(`Unmuted ${member.user}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
      return channel.send({ embed })
    } else {
      return ctx.reply(`Unmuted ${member.user}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
    }
  }
}

module.exports = Unmute

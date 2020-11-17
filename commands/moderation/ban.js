const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Ban extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Bans a user.',
      userPermissions: ['BAN_MEMBERS'],
      botPermissions: ['BAN_MEMBERS', 'EMBED_LINKS'],
      guildOnly: true,
      usage: 'ban <@member> [reason]'
    })
  }

  async run (ctx, [member, ...reason]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.reply('Why would you ban yourself?')
    if (member.id === this.client.user.id) return ctx.reply('Why would you ban me?')
    if (member.id === ctx.guild.ownerID) return ctx.reply("You can't ban the owner.")

    if (member.roles.highest.position >= ctx.member.roles.highest.position) return ctx.reply('You cannot ban this user.')
    if (!member.bannable) return ctx.reply('I cannot ban this user.')

    const options = { days: 7 }
    reason = reason.length ? reason.join(' ') : null
    if (reason) options.reason = reason

    await member.ban(options)

    if (ctx.guild.settings.modlog) {
      const channel = this.client.channels.cache.get(ctx.guild.settings.modlog)
      if (!channel) return
      var caseNum = ctx.guild.settings.modlogCase
      caseNum++
      await ctx.guild.update({ modlogCase: caseNum })
      var embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ size: 32 }))
        .addField('Action', 'Ban')
        .addField('Reason', reason || 'No reason specified')
        .addField('Responsible moderator', `${ctx.author.tag}`)
        .setFooter(`Case ${caseNum}`)
        .setTimestamp()

      ctx.reply(`Banned ${member.user.tag}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
      return channel.send({ embed })
    } else {
      return ctx.reply(`Banned ${member.user.tag}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
    }
  }
}

module.exports = Ban

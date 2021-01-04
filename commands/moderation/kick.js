const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Kick extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Kicks a user.',
      userPermissions: ['KICK_MEMBERS'],
      botPermissions: ['KICK_MEMBERS', 'EMBED_LINKS'],
      guildOnly: true,
      usage: 'kick <@member> [reason]'
    })
  }

  async run(ctx, [member, ...reason]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.reply('Why would you kick yourself?')
    if (member.id === this.client.user.id) return ctx.reply('Why would you kick me?')
    if (member.id === ctx.guild.ownerID) return ctx.reply("You can't kick the owner.")

    if (member.roles.highest.position >= ctx.member.roles.highest.position) return ctx.reply('You cannot kick this user.')
    if (!member.kickable) return ctx.reply('I cannot kick this user.')

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
        .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ size: 32 }))
        .addField('Action', 'Kick')
        .addField('Reason', reason || 'No reason specified')
        .addField('Responsible moderator', `${ctx.author.tag}`)
        .setFooter(`Case ${caseNum}`)
        .setTimestamp()

      ctx.reply(`Kicked ${member.user.tag}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
      return channel.send({ embed })
    } else {
      return ctx.reply(`Kicked ${member.user.tag}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
    }
  }
}

module.exports = Kick

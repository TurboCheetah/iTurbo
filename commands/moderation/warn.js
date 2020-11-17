const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Warn extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Warns a member',
      userPermissions: ['KICK_MEMBERS'],
      botPermissions: ['EMBED_LINKS'],
      usage: 'warn <@user> <reason>',
      guildOnly: true
    })
  }

  async run (ctx, [member, ...reason]) {
    member = await this.verifyUser(ctx, member)
    if (!reason.length) return ctx.reply("You didn't give me a reason.")
    reason = reason.length ? reason.join(' ') : null

    if (member.id === ctx.author.id) return ctx.reply("You can't warn yourself.")
    if (member.id === this.client.user.id) return ctx.reply('Why would you try to warn me?')
    if (member.bot) return ctx.reply("You can't warn bots.")
    if (member.id === ctx.guild.ownerID) return ctx.reply("You can't warn the owner.")

    try {
      await member.send(`You've been warned by **${ctx.author.tag}** in **${ctx.guild.name}** for: ${reason}`)
      if (ctx.guild.settings.modlog) {
        const channel = this.client.channels.cache.get(ctx.guild.settings.modlog)
        if (!channel) return
        var caseNum = ctx.guild.settings.modlogCase
        caseNum++
        await ctx.guild.update({ modlogCase: caseNum })
        var embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setAuthor(`${member.tag} (${member.id})`, member.displayAvatarURL({ size: 32 }))
          .addField('Action', 'Warn')
          .addField('Reason', reason || 'No reason specified')
          .addField('Responsible moderator', `${ctx.author.tag}`)
          .setFooter(`Case ${caseNum}`)
          .setTimestamp()

        ctx.reply(`Warned ${member.tag}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
        return channel.send({ embed })
      } else {
        return ctx.reply(`Warned ${member.tag}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
      }
    } catch (err) {
      console.error(err)
      return ctx.reply("I couldn't DM the user, maybe they have DMs blocked.")
    }
  }
}

module.exports = Warn

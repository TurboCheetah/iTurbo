const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class HackBan extends Command {
  constructor(...args) {
    super(...args, {
      description: "Bans a user that isn't in the server.",
      extendedHelp: 'This command will ban a user that is not in the server to prevent them from joining in the future.',
      userPermissions: ['BAN_MEMBERS'],
      aliases: ['hban'],
      botPermissions: ['BAN_MEMBERS', 'EMBED_LINKS'],
      usage: 'hackban <userID> [reason]',
      guildOnly: true
    })
  }

  async run(ctx, [id, ...reason]) {
    if (!id) return ctx.reply(`Usage: \`${ctx.guild.prefix}${this.usage}\``)

    if (isNaN(parseInt(id))) return ctx.reply('Invalid user id.')

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
          .addField('Action', 'Ban')
          .addField('Reason', reason || 'No reason specified')
          .addField('Responsible moderator', `${ctx.author.tag}`)
          .setFooter(`Case ${caseNum}`)
          .setTimestamp()

        ctx.reply(`Banned ${user.tag}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
        return channel.send({ embed })
      } else {
        return ctx.reply(`Banned ${user.tag}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
      }
    } catch (err) {
      return ctx.reply("Couldn't ban that user, make sure the ID is valid.")
    }
  }
}

module.exports = HackBan

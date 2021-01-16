const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Mute extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Mutes a user.',
      userPermissions: ['KICK_MEMBERS'],
      botPermissions: ['KICK_MEMBERS', 'EMBED_LINKS'],
      guildOnly: true,
      usage: 'mute <@member> [reason]'
    })
  }

  async run(ctx, [member, ...reason]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.reply('Why would you mute yourself?')
    if (member.id === this.client.user.id) return ctx.reply('Why would you mute me?')
    if (member.id === ctx.guild.ownerID) return ctx.reply("You can't mute the owner.")

    if (member.roles.highest.position >= ctx.member.roles.highest.position) return ctx.reply('You cannot mute this user.')

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
          ctx.reply('Muted role was not found. Please re-run the command and it will be created.')
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
        .addField('Action', 'Mute')
        .addField('Reason', reason || 'No reason specified')
        .addField('Responsible moderator', `${ctx.author.tag}`)
        .setFooter(`Case ${caseNum}`)
        .setTimestamp()

      ctx.reply(`Muted ${member.user}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
      return channel.send({ embed })
    } else {
      return ctx.reply(`Muted ${member.user}. Reason: ${reason ? `${reason}` : 'No reason specified'}`)
    }
  }
}

module.exports = Mute
